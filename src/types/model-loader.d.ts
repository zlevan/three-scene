import type { Colors } from './color'
import type { IndexDB } from './indexdb'

export declare interface ProgressListItem {
  name: string
  percentage: number
}

export declare interface Progress {
  percentage: number
  show: boolean
  isEnd: boolean
  list: ProgressListItem[]
  total: number
  loaded: number
}

export declare interface Options {
  baseUrl: string
  dracoPath: string
  basisPath: string
  modelSizeKB: number
  colors: Colors
  loadCache: boolean
  colorMeshName: string[]
  indexDB: IndexDB
}

export declare interface VtOptions {
  color: string | string
  opacity: number
  wireframe: boolean
  filter: string[]
  filterMatch: string[]
}
