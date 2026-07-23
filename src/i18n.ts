export type Locale = 'pt' | 'en' | 'de'

export const locales: { id: Locale; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
]

export function detectLocale(): Locale {
  const stored = window.localStorage.getItem('bugsweeper-locale')
  if (stored === 'pt' || stored === 'en' || stored === 'de') return stored
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'de') return 'de'
  if (browser === 'pt') return 'pt'
  return 'en'
}

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export const severityLabels: Record<Locale, Record<Severity, string>> = {
  pt: { critical: 'Crítica', high: 'Alta', medium: 'Média', low: 'Baixa' },
  en: { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' },
  de: { critical: 'Kritisch', high: 'Hoch', medium: 'Mittel', low: 'Niedrig' },
}

type UiStrings = {
  title: string
  tagline: string
  intro: string
  difficulty: string
  difficultyLevels: { iniciante: string; intermedio: string; avancado: string }
  mode: string
  modeLevels: { aprendizagem: string; classico: string }
  modeHint: { aprendizagem: string; classico: string }
  flagMode: string
  minesLabel: string
  timeLabel: string
  reset: string
  statusReady: string
  statusPlaying: string
  statusWon: string
  statusLost: string
  causeLabel: string
  fixLabel: string
  close: string
  vulnFoundTitle: string
  vulnHitTitle: string
  playAgain: string
  glossaryTitle: string
  glossaryProgress: (found: number, total: number) => string
  glossaryLocked: string
  winTitle: string
  winBody: string
  lossTitle: string
  lossBody: string
  footer: string
  howTo: string
}

export const ui: Record<Locale, UiStrings> = {
  pt: {
    title: 'BugSweeper',
    tagline: 'Campo minado de segurança',
    intro: 'Cada mina escondida é uma vulnerabilidade web real. Encontra-a e aprende a preveni-la.',
    difficulty: 'Dificuldade',
    difficultyLevels: { iniciante: 'Iniciante', intermedio: 'Intermédio', avancado: 'Avançado' },
    mode: 'Modo',
    modeLevels: { aprendizagem: 'Aprendizagem', classico: 'Clássico' },
    modeHint: {
      aprendizagem: 'Encontrar uma mina explica a vulnerabilidade e o jogo continua.',
      classico: 'Encontrar uma mina termina o jogo, como no campo minado tradicional.',
    },
    flagMode: 'Modo bandeira (toque)',
    minesLabel: 'Minas',
    timeLabel: 'Tempo',
    reset: 'Recomeçar',
    statusReady: 'Clica numa célula para começar',
    statusPlaying: 'A analisar o código…',
    statusWon: 'Código limpo! Encontraste todas as células seguras.',
    statusLost: 'Vulnerabilidade explorada.',
    causeLabel: 'Causa',
    fixLabel: 'Como prevenir',
    close: 'Fechar',
    vulnFoundTitle: 'Vulnerabilidade encontrada',
    vulnHitTitle: 'Foi aqui que o código falhou',
    playAgain: 'Jogar outra vez',
    glossaryTitle: 'Glossário de vulnerabilidades',
    glossaryProgress: (found, total) => `${found}/${total} descobertas`,
    glossaryLocked: 'Por descobrir',
    winTitle: 'Vitória',
    winBody: 'Limpaste o tabuleiro sem comprometer o sistema. Aqui está tudo o que estava escondido:',
    lossTitle: 'Fim de jogo',
    lossBody: 'O tabuleiro completo, com todas as vulnerabilidades que lá estavam:',
    footer: 'Um jogo de Bruno Rendeiro sobre erros comuns de segurança web.',
    howTo: 'Clique para revelar · botão direito (ou modo bandeira) para marcar uma suspeita',
  },
  en: {
    title: 'BugSweeper',
    tagline: 'A security-themed minesweeper',
    intro: 'Every hidden mine is a real web vulnerability. Find it, then learn how to prevent it.',
    difficulty: 'Difficulty',
    difficultyLevels: { iniciante: 'Beginner', intermedio: 'Intermediate', avancado: 'Expert' },
    mode: 'Mode',
    modeLevels: { aprendizagem: 'Learning', classico: 'Classic' },
    modeHint: {
      aprendizagem: 'Hitting a mine explains the vulnerability and the game continues.',
      classico: 'Hitting a mine ends the game, just like traditional minesweeper.',
    },
    flagMode: 'Flag mode (touch)',
    minesLabel: 'Mines',
    timeLabel: 'Time',
    reset: 'Restart',
    statusReady: 'Click a cell to start',
    statusPlaying: 'Scanning the codebase…',
    statusWon: 'Clean code! You found every safe cell.',
    statusLost: 'Vulnerability exploited.',
    causeLabel: 'Cause',
    fixLabel: 'How to prevent it',
    close: 'Close',
    vulnFoundTitle: 'Vulnerability found',
    vulnHitTitle: 'This is where the code broke',
    playAgain: 'Play again',
    glossaryTitle: 'Vulnerability glossary',
    glossaryProgress: (found, total) => `${found}/${total} discovered`,
    glossaryLocked: 'Undiscovered',
    winTitle: 'You won',
    winBody: 'You cleared the board without compromising the system. Here is everything that was hidden:',
    lossTitle: 'Game over',
    lossBody: 'The full board, with every vulnerability it contained:',
    footer: 'A game by Bruno Rendeiro about common web security mistakes.',
    howTo: 'Click to reveal · right-click (or flag mode) to mark a suspicion',
  },
  de: {
    title: 'BugSweeper',
    tagline: 'Minesweeper mit Sicherheitsfokus',
    intro: 'Jede versteckte Mine ist eine echte Web-Schwachstelle. Finde sie und lerne, wie man sie verhindert.',
    difficulty: 'Schwierigkeit',
    difficultyLevels: { iniciante: 'Anfänger', intermedio: 'Mittel', avancado: 'Experte' },
    mode: 'Modus',
    modeLevels: { aprendizagem: 'Lernmodus', classico: 'Klassisch' },
    modeHint: {
      aprendizagem: 'Eine Mine erklärt die Schwachstelle, das Spiel geht weiter.',
      classico: 'Eine Mine beendet das Spiel, wie beim klassischen Minesweeper.',
    },
    flagMode: 'Flaggenmodus (Touch)',
    minesLabel: 'Minen',
    timeLabel: 'Zeit',
    reset: 'Neu starten',
    statusReady: 'Klicke auf ein Feld, um zu starten',
    statusPlaying: 'Code wird gescannt…',
    statusWon: 'Sauberer Code! Du hast alle sicheren Felder gefunden.',
    statusLost: 'Schwachstelle ausgenutzt.',
    causeLabel: 'Ursache',
    fixLabel: 'Wie man es verhindert',
    close: 'Schließen',
    vulnFoundTitle: 'Schwachstelle gefunden',
    vulnHitTitle: 'Hier ist der Code gebrochen',
    playAgain: 'Nochmal spielen',
    glossaryTitle: 'Schwachstellen-Glossar',
    glossaryProgress: (found, total) => `${found}/${total} entdeckt`,
    glossaryLocked: 'Unentdeckt',
    winTitle: 'Gewonnen',
    winBody: 'Du hast das Feld geräumt, ohne das System zu kompromittieren. Hier ist alles, was versteckt war:',
    lossTitle: 'Spiel vorbei',
    lossBody: 'Das vollständige Feld mit allen enthaltenen Schwachstellen:',
    footer: 'Ein Spiel von Bruno Rendeiro über häufige Web-Sicherheitsfehler.',
    howTo: 'Klicken zum Aufdecken · Rechtsklick (oder Flaggenmodus) zum Markieren eines Verdachts',
  },
}
