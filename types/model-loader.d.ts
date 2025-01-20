import type { Colors } from './color'
import type { IndexDB } from './indexdb'

export interface ProgressListItem {
  name: string
  percentage: number
}

export interface Progress {
  /**
   * 进度
   */
  percentage: number

  /**
   * 进度展示
   * @default false
   */
  show: boolean

  /**
   * 是否加载结束（用于加载全部）
   * @default false
   */
  isEnd: boolean

  /**
   * 加载列表
   */
  list: ProgressListItem[]

  /**
   * 加载文件总大小
   */
  total: number

  /**
   * 已加载文件大小
   */
  loaded: number
}

export interface Options {
  /**
   * 基础地址
   */
  baseUrl: string

  /**
   * draco 解压文件路径
   * @default '/three/draco/gltf/'
   */
  dracoPath: string

  /**
   * basis 解压文件路径
   * @default '/three/basis/'
   */
  basisPath: string

  /**
   * 模型大小
   * @default 1024 * 1024
   */
  modelSizeKB: number

  /**
   * 颜色
   */
  colors: Colors

  /**
   * 改变颜色材质网格名称集合
   */
  colorMeshName: string[]

  /**
   * indexDB
   */
  indexDB: IndexDB
}

export interface VtOptions {
  /**
   * 颜色
   */
  color: string | string

  /**
   * 透明度
   */
  opacity: number

  /**
   * 隐藏模式（默认虚化模式，如果为隐藏模式，则隐藏模型）
   */
  hidden: boolean

  /**
   * 是否显示网格
   */
  wireframe: boolean

  /**
   * 过滤器 （过滤模型名称）
   */
  filter: string[]

  /**
   * 过滤器匹配 （过滤模型名称匹配）
   */
  filterMatch: string[]
}

export interface ModelMap {
  /**
   * 基础底座
   */
  base: string
  /**
   * 场景设备
   */
  device: string
  /**
   * 字体
   */
  font: string
  /**
   * 精灵
   */
  sprite: string
  /**
   * 管路贴图
   */
  pipe: string
  /**
   * 警告标识
   */
  warning: string
  /**
   * 远程状态
   */
  remote: string
  /**
   * 本地标识
   */
  local: string
  /**
   * 禁用标识
   */
  disabled: string
  /**
   * 聚光灯
   */
  spotlight: string
}
