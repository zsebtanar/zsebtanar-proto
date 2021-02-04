export interface MD {
  helpers
  inline
}

export interface State {
  src: string
  pos: number
  posMax: number
  push: (name: string, tag: string, pos: number) => void
  md: MD
}
