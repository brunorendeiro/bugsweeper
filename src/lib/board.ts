import { vulnerabilityList } from '../data/vulnerabilities'

export type Cell = {
  isMine: boolean
  vulnId: string | null
  adjacent: number
  revealed: boolean
  flagged: boolean
}

export type Board = Cell[][]

export type DifficultyKey = 'iniciante' | 'intermedio' | 'avancado'

export const difficultyKeys: DifficultyKey[] = ['iniciante', 'intermedio', 'avancado']

export const difficulties: Record<DifficultyKey, { rows: number; cols: number; mines: number }> = {
  iniciante: { rows: 9, cols: 9, mines: 10 },
  intermedio: { rows: 16, cols: 16, mines: 40 },
  avancado: { rows: 16, cols: 30, mines: 99 },
}

function shuffle<T>(items: T[]): T[] {
  const array = [...items]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): Cell => ({ isMine: false, vulnId: null, adjacent: 0, revealed: false, flagged: false })),
  )
}

const neighborOffsets = [-1, 0, 1]
  .flatMap(dr => [-1, 0, 1].map((dc): [number, number] => [dr, dc]))
  .filter(([dr, dc]) => dr !== 0 || dc !== 0)

export function neighborsOf(rows: number, cols: number, r: number, c: number): [number, number][] {
  return neighborOffsets
    .map((offset): [number, number] => [r + offset[0], c + offset[1]])
    .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols)
}

/** Coloca minas evitando a célula clicada e os seus vizinhos, para garantir uma primeira jogada segura. */
export function placeMines(board: Board, mineCount: number, safeR: number, safeC: number) {
  const rows = board.length
  const cols = board[0].length
  const safeZone = new Set([`${safeR},${safeC}`, ...neighborsOf(rows, cols, safeR, safeC).map(([r, c]) => `${r},${c}`)])
  const candidates: [number, number][] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeZone.has(`${r},${c}`)) candidates.push([r, c])
    }
  }
  const chosen = shuffle(candidates).slice(0, mineCount)
  const vulnOrder = shuffle(vulnerabilityList)
  chosen.forEach(([r, c], index) => {
    board[r][c].isMine = true
    board[r][c].vulnId = vulnOrder[index % vulnOrder.length].id
  })
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue
      board[r][c].adjacent = neighborsOf(rows, cols, r, c).filter(([nr, nc]) => board[nr][nc].isMine).length
    }
  }
}

export function floodReveal(board: Board, startR: number, startC: number) {
  const rows = board.length
  const cols = board[0].length
  const queue: [number, number][] = [[startR, startC]]
  const seen = new Set<string>()
  while (queue.length) {
    const next = queue.shift()!
    const key = `${next[0]},${next[1]}`
    if (seen.has(key)) continue
    seen.add(key)
    const cell = board[next[0]][next[1]]
    if (cell.flagged || cell.revealed) continue
    cell.revealed = true
    if (cell.adjacent === 0 && !cell.isMine) {
      for (const neighbor of neighborsOf(rows, cols, next[0], next[1])) {
        if (!board[neighbor[0]][neighbor[1]].revealed) queue.push(neighbor)
      }
    }
  }
}

export function revealAllMines(board: Board) {
  for (const row of board) for (const cell of row) if (cell.isMine) cell.revealed = true
}

export function countRevealedSafe(board: Board): number {
  let count = 0
  for (const row of board) for (const cell of row) if (cell.revealed && !cell.isMine) count++
  return count
}

export function totalSafeCells(board: Board): number {
  let count = 0
  for (const row of board) for (const cell of row) if (!cell.isMine) count++
  return count
}

export function countFlags(board: Board): number {
  let count = 0
  for (const row of board) for (const cell of row) if (cell.flagged) count++
  return count
}

export function mineVulnIds(board: Board): string[] {
  const ids: string[] = []
  for (const row of board) for (const cell of row) if (cell.isMine && cell.vulnId) ids.push(cell.vulnId)
  return ids
}
