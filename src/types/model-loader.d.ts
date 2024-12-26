import type { Colors } from './color'
import type { IndexDB } from './indexdb'

export interface ProgressListItem {
  name: string
  percentage: number
}

export interface Progress {
  percentage: number
  show: boolean
  isEnd: boolean
  list: ProgressListItem[]
  total: number
  loaded: number
}

export interface Options {
  baseUrl: string
  dracoPath: string
  basisPath: string
  modelSizeKB: number
  colors: Colors
  loadCache: boolean
  colorMeshName: string[]
  indexDB: IndexDB
}

export interface VtOptions {
  color: string | string
  opacity: number
  wireframe: boolean
  filter: string[]
  filterMatch: string[]
}

export interface ModelMap {
  // base-基础底座,
  base: string
  // device-场景设备,
  device: string
  // font-字体,
  font: string
  // sprite-精灵,
  sprite: string
  // pipe-管路贴图
  pipe: string
  // warning-警告标识,
  warning: string
  // remote-远程状态，
  remote: string
  // local-本地标识，
  local: string
  // disabled-禁用标识
  disabled: string
  // 聚光灯
  spotlight: string
}
