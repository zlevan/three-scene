import type { XYZ } from '../types/model'

export declare interface Options {
  index: number
  length: number
  runing: boolean
  model?: any
  speed: number
  endCallback?: (pos: XYZ) => void
  rungingCall?: (pos: XYZ) => void
}
