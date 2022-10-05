export interface PostCommandData {
  name: string,
  type: number,
  description: string,
}

export interface Option {
  name: string,
  type: number,
  value: string,
  option: string[]
}

export interface State {
  state: string
  mode: "auto" | "manual",
  timer: string,
  round: string,
  players: string[]
}

export interface GameInfo {
  round: number,
  players: Player[],
  word: Word
}

interface Player {
  name: string,
  point: number,
  voted: number,
}

interface Word {
  human: string,
  wolf: string,
}