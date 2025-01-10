import type { XYZ } from './model'

export interface Options {
  index: number
  length: number
  runing: boolean
  model?: any
  speed: number
  endCallback?: (pos: XYZ) => void
  rungingCall?: (pos: XYZ, stop: () => void) => void
}
