import * as THREE from 'three'

/**
 * 三维坐标
 */
export interface XYZ {
  x: number
  y: number
  z: number
}

/**
 * 字体配置
 */
export interface Font {
  /**
   * 字体大小
   */
  size?: number | string

  /**
   * 字体颜色
   */
  color?: string

  /**
   * 字体坐标
   */
  position?: XYZ

  /**
   * 字体旋转角度
   */
  rotation?: XYZ
}

/**
 * 模型映射
 */
export type ModelType =
  | 'base'
  | 'device'
  | 'font'
  | 'sprite'
  | 'pipe'
  | 'warning'
  | 'remote'
  | 'local'
  | 'disabled'
  | 'spotlight'

/**
 * 模型
 */
export interface ModelItem {
  /**
   * 模型 唯一 key（场景元素按照 对应 key 加载）
   */
  key: string

  /**
   * 模型名称
   */
  name: string

  /**
   * 模型文件大小 （M 为单位）
   */
  size?: number

  /**
   * 模型加载地址
   */
  url?: string

  /**
   * 模型类型
   * @remarks base-基础底座， device-场景设备, font-字体, sprite-精灵, pipe-管路贴图
   * warning-警告标识, remote-远程状态， local-本地标识， disabled-禁用标识
   */
  type?: ModelType

  /**
   * 贴图
   */
  mapUrl?: string

  /**
   * 需要贴图的网格名称
   */
  mapMeshName?: string

  /**
   * 精灵贴图
   */
  repeat?: number[]

  /**
   * 精灵大小
   */
  range?: Pick<XYZ, 'x' | 'y'>

  // ==== 灯光 ===
  /**
   * 灯光颜色
   */
  color?: string | number

  /**
   * 灯光强度
   */
  intensity?: number

  /**
   * 灯光照射距离
   */
  distance?: number

  /**
   * 灯光衰减值
   */
  decay?: number

  /**
   * 光线散射角度，最大为Math.PI/2。
   */
  angle?: number

  /**
   * 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
   */
  penumbra?: number
}

export interface ObjectItem {
  /**
   * 名称
   */
  name: string

  /**
   * 类型 初始化模型对应的 key
   */
  type: string

  show?: boolean
  value?: number
  unit?: string
  code?: string
  deviceCode?: string

  /**
   * 三维坐标
   */
  position?: XYZ

  /**
   * 旋转角度
   */
  rotation?: XYZ

  /**
   * 缩放比例
   */
  scale?: XYZ

  /**
   * 字体配置
   */
  font?: Font

  /**
   * 相机动画移动至位置
   */
  to?: XYZ

  /**
   * 场景控制中心点
   */
  target?: XYZ

  /**
   * 模型地址（如地址变换频繁的模型）
   */
  url?: string

  /**
   * 标记
   */
  mark?: string

  /**
   * 跟随标记
   */
  followMark?: string

  id?: number

  /**
   * 运行状态
   */
  status?: number

  /**
   * 故障状态
   */
  error?: number

  /**
   * 远程状态
   */
  remote?: number

  /**
   * 本地状态
   */
  local?: number

  /**
   * 禁用状态
   */
  disabled?: number

  /**
   * 双击事件回调函数
   */
  onDblclick?: Function

  /**
   * 点击事件回调函数
   */
  onClick?: Function

  /**
   * 绑定参数（如模型内某个“零件”的网格/组名称）
   */
  bind?: string
}

export interface PipeItem {
  /**
   * 名称
   */
  name: string

  /**
   * 类型 初始化模型对应的 key
   */
  type: string

  /**
   * 三维坐标
   */
  position?: XYZ

  /**
   * 旋转角度
   */
  rotation?: XYZ

  /**
   * 缩放比例
   */
  scale?: XYZ

  // 管路
  /**
   * 贴图重复次数[x,y0]
   */
  map?: number[]

  /**
   * 绑定设备（管路关联设备。设备动则动,只要满足一个设备运行则执行）
   * @example
   * [ [ 'LDB_1-1', 'FM_1-1' ], [ 'LDB_1-2', 'FM_1-1' ] ]
   */
  bind?: (string | string[] | string[][])[]

  /**
   * 流动左边绑定设备
   */
  left?: (string | string[] | string[][])[]

  /**
   * 流动右边绑定设备
   */
  right?: (string | string[] | string[][])[]
}

export interface Extra {
  /**
   * 动画混合器
   */
  mixer: any
}

export type ThreeModelItem = {
  /**
   * 可见
   */
  visible: boolean

  /**
   * 备用坐标
   */
  _position_?: XYZ

  /**
   * 绑定数据
   */
  data?: ObjectItem

  /**
   * 额外属性
   */
  extra?: Extra

  /**
   * 清理函数
   */
  clear: Function

  /**
   * dom 元素
   */
  element?: HTMLElement

  /**
   * 是否为警告
   */
  _isWarning_?: boolean

  [key: string]: any
} & THREE.Object3D

export interface StylePosition {
  /**
   * left 属性
   */
  left: number
  /**
   * top 属性
   */
  top: number
}
