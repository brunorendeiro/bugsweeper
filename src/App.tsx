import { useEffect, useMemo, useState } from 'react'
import {
  countFlags,
  countRevealedSafe,
  createEmptyBoard,
  difficultyKeys,
  difficulties,
  floodReveal,
  mineVulnIds,
  placeMines,
  revealAllMines,
  totalSafeCells,
  type Board,
  type DifficultyKey,
} from './lib/board'
import { getVulnerability } from './data/vulnerabilities'
import { detectLocale, locales, severityLabels, ui, type Locale } from './i18n'

type Mode = 'aprendizagem' | 'classico'
type Status = 'ready' | 'playing' | 'won' | 'lost'

const numberColors = ['', '#4d7cff', '#52c774', '#ff5c5c', '#c084fc', '#c9860a', '#3fd0c9', '#f4efe4', '#9c9587']

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [difficulty, setDifficulty] = useState<DifficultyKey>('iniciante')
  const [mode, setMode] = useState<Mode>('aprendizagem')
  const [flagMode, setFlagMode] = useState(false)
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(difficulties.iniciante.rows, difficulties.iniciante.cols))
  const [minesPlaced, setMinesPlaced] = useState(false)
  const [status, setStatus] = useState<Status>('ready')
  const [elapsed, setElapsed] = useState(0)
  const [activeVulnId, setActiveVulnId] = useState<string | null>(null)
  const [explodedCell, setExplodedCell] = useState<[number, number] | null>(null)
  const [foundVulnIds, setFoundVulnIds] = useState<Set<string>>(new Set())

  const t = ui[locale]

  useEffect(() => {
    window.localStorage.setItem('bugsweeper-locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  useEffect(() => {
    if (status !== 'playing') return
    const id = window.setInterval(() => setElapsed(value => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [status])

  function resetGame(nextDifficulty: DifficultyKey, nextMode: Mode) {
    const config = difficulties[nextDifficulty]
    setDifficulty(nextDifficulty)
    setMode(nextMode)
    setBoard(createEmptyBoard(config.rows, config.cols))
    setMinesPlaced(false)
    setStatus('ready')
    setElapsed(0)
    setActiveVulnId(null)
    setExplodedCell(null)
    setFoundVulnIds(new Set())
  }

  function toggleFlag(r: number, c: number) {
    if (status === 'lost' || status === 'won') return
    const cell = board[r][c]
    if (cell.revealed) return
    const next = structuredClone(board)
    next[r][c].flagged = !next[r][c].flagged
    setBoard(next)
    if (status === 'ready') setStatus('playing')
  }

  function handleReveal(r: number, c: number) {
    if (status === 'lost' || status === 'won') return
    if (flagMode) {
      toggleFlag(r, c)
      return
    }
    const current = board[r][c]
    if (current.flagged || current.revealed) return

    const next = structuredClone(board)
    if (!minesPlaced) {
      placeMines(next, difficulties[difficulty].mines, r, c)
      setMinesPlaced(true)
    }
    const cell = next[r][c]
    let nextStatus: Status = status === 'ready' ? 'playing' : status

    if (cell.isMine) {
      cell.revealed = true
      setActiveVulnId(cell.vulnId)
      if (mode === 'classico') {
        revealAllMines(next)
        nextStatus = 'lost'
        setExplodedCell([r, c])
        setFoundVulnIds(new Set(mineVulnIds(next)))
      } else {
        setFoundVulnIds(prev => new Set(prev).add(cell.vulnId ?? ''))
      }
    } else {
      floodReveal(next, r, c)
      setActiveVulnId(null)
    }

    if (nextStatus !== 'lost' && countRevealedSafe(next) === totalSafeCells(next)) {
      nextStatus = 'won'
      setFoundVulnIds(new Set(mineVulnIds(next)))
    }

    setBoard(next)
    setStatus(nextStatus)
  }

  const activeVuln = activeVulnId ? getVulnerability(activeVulnId, locale) : null
  const config = difficulties[difficulty]
  const flags = useMemo(() => countFlags(board), [board])
  const minesRemaining = config.mines - flags
  const distinctVulnIds = useMemo(() => new Set(mineVulnIds(board)), [board])
  const gameOver = status === 'won' || status === 'lost'

  const statusMessage = status === 'ready' ? t.statusReady
    : status === 'playing' ? t.statusPlaying
    : status === 'won' ? t.statusWon
    : t.statusLost

  return <div className="app">
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">🐞</span>
        <div>
          <strong>{t.title}</strong>
          <small>{t.tagline}</small>
        </div>
      </div>
      <div className="locale-switch" role="group" aria-label="Language">
        {locales.map(item => (
          <button key={item.id} className={locale === item.id ? 'active' : ''} onClick={() => setLocale(item.id)}>{item.label}</button>
        ))}
      </div>
    </header>

    <p className="intro">{t.intro}</p>

    <section className="controls">
      <div className="control-group">
        <span>{t.difficulty}</span>
        <div className="segmented">
          {difficultyKeys.map(key => (
            <button key={key} className={difficulty === key ? 'active' : ''} onClick={() => resetGame(key, mode)}>
              {t.difficultyLevels[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="control-group">
        <span>{t.mode}</span>
        <div className="segmented">
          {(['aprendizagem', 'classico'] as Mode[]).map(key => (
            <button key={key} className={mode === key ? 'active' : ''} onClick={() => resetGame(difficulty, key)}>
              {t.modeLevels[key]}
            </button>
          ))}
        </div>
      </div>
      <label className="flag-toggle">
        <input type="checkbox" checked={flagMode} onChange={event => setFlagMode(event.target.checked)} />
        🚩 {t.flagMode}
      </label>
    </section>

    <p className="mode-hint">{t.modeHint[mode]}</p>

    <section className="stats-bar">
      <div className="digits">{String(Math.max(minesRemaining, 0)).padStart(3, '0')}<small>{t.minesLabel}</small></div>
      <button className="reset-face" onClick={() => resetGame(difficulty, mode)} aria-label={t.reset}>
        {status === 'won' ? '😎' : status === 'lost' ? '💀' : '🙂'}
      </button>
      <div className="digits">{formatTime(elapsed)}<small>{t.timeLabel}</small></div>
    </section>

    <p className="status-message" role="status">{statusMessage}</p>

    <div className="board-scroll">
      <div className="board" style={{ '--cols': config.cols } as React.CSSProperties}>
        {board.map((row, r) => row.map((cell, c) => {
          const isExploded = explodedCell?.[0] === r && explodedCell?.[1] === c
          let content: React.ReactNode = ''
          if (cell.flagged && !cell.revealed) content = '🚩'
          else if (cell.revealed && cell.isMine) content = isExploded ? '💥' : '🐞'
          else if (cell.revealed && cell.adjacent > 0) content = cell.adjacent
          const className = [
            'cell',
            cell.revealed ? 'revealed' : '',
            cell.revealed && cell.isMine ? (isExploded ? 'exploded' : 'mine') : '',
          ].filter(Boolean).join(' ')
          return (
            <button
              key={`${r}-${c}`}
              className={className}
              style={cell.revealed && cell.adjacent > 0 ? { color: numberColors[cell.adjacent] } as React.CSSProperties : undefined}
              onClick={() => handleReveal(r, c)}
              onContextMenu={event => { event.preventDefault(); toggleFlag(r, c) }}
              disabled={gameOver}
              aria-label={`${r + 1},${c + 1}`}
            >
              {content}
            </button>
          )
        }))}
      </div>
    </div>

    <p className="how-to">{t.howTo}</p>

    {activeVuln && !gameOver && (
      <div className="vuln-toast" role="alert">
        <div className="vuln-toast-head">
          <span className={`severity sev-${activeVuln.severity}`}>{severityLabels[locale][activeVuln.severity]}</span>
          <button className="close" onClick={() => setActiveVulnId(null)} aria-label={t.close}>✕</button>
        </div>
        <h3>{t.vulnFoundTitle}: {activeVuln.name}</h3>
        <p><strong>{t.causeLabel}:</strong> {activeVuln.cause}</p>
        <p><strong>{t.fixLabel}:</strong> {activeVuln.fix}</p>
      </div>
    )}

    {gameOver && (
      <section className="end-panel">
        <h2>{status === 'won' ? t.winTitle : t.lossTitle}</h2>
        <p>{status === 'won' ? t.winBody : t.lossBody}</p>
        {status === 'lost' && activeVuln && (
          <div className="vuln-card highlight">
            <span className={`severity sev-${activeVuln.severity}`}>{severityLabels[locale][activeVuln.severity]}</span>
            <h3>{t.vulnHitTitle}: {activeVuln.name}</h3>
            <p><strong>{t.causeLabel}:</strong> {activeVuln.cause}</p>
            <p><strong>{t.fixLabel}:</strong> {activeVuln.fix}</p>
          </div>
        )}
        <button className="primary" onClick={() => resetGame(difficulty, mode)}>{t.playAgain}</button>
      </section>
    )}

    <section className="glossary">
      <div className="glossary-head">
        <h2>{t.glossaryTitle}</h2>
        <span>{t.glossaryProgress(foundVulnIds.size, distinctVulnIds.size || Math.min(config.mines, 15))}</span>
      </div>
      <div className="glossary-grid">
        {[...distinctVulnIds].map(id => {
          const vuln = getVulnerability(id, locale)
          if (!vuln) return null
          const discovered = foundVulnIds.has(id)
          return (
            <div key={id} className={`vuln-card ${discovered ? '' : 'locked'}`}>
              {discovered ? <>
                <span className={`severity sev-${vuln.severity}`}>{severityLabels[locale][vuln.severity]}</span>
                <h3>{vuln.name}</h3>
                <p>{vuln.fix}</p>
              </> : <>
                <span className="severity sev-locked">🔒</span>
                <h3>{t.glossaryLocked}</h3>
              </>}
            </div>
          )
        })}
      </div>
    </section>

    <footer>{t.footer}</footer>
  </div>
}
