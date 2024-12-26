import * as THREE from 'three'

export interface XYZ {
  x: number
  y: number
  z: number
}

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

export interface ModelItem {
  // 模型 唯一 key（场景元素按照 对应 key 加载）
  key: string
  name: string
  // 模型文件大小 （M 为单位）
  size?: number
  // 模型加载地址
  url?: string
  // 模型类型
  // base-基础底座， device-场景设备, font-字体, sprite-精灵, pipe-管路贴图
  // warning-警告标识, remote-远程状态， local-本地标识， disabled-禁用标识
  type?: ModelType
  // 贴图
  mapUrl?: string
  // 需要贴图的网格名称
  mapMeshName?: string
  // 精灵贴图
  repeat?: number[]
  // 精灵大小
  range?: Pick<XYZ, 'x' | 'y'>

  // ==== 灯光 ===
  // 颜色
  color?: string | number
  // 强度
  intensity?: number
  // 距离
  distance?: number
  // 衰减
  decay?: number
  // 光线散射角度，最大为Math.PI/2。
  angle?: number
  // 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
  penumbra?: number
}

export interface ObjectItem {
  name: string
  // 类型 初始化模型对应的 key
  type: string
  show?: boolean
  value?: number
  unit?: string
  code?: string
  deviceCode?: string

  // 位置、旋转、缩放
  position?: XYZ
  rotation?: XYZ
  scale?: XYZ

  // 字体
  font?: Font
  // 相机动画位置
  to?: XYZ
  // 场景中心点
  target?: XYZ
  url?: string
  // 标记
  mark?: string
  // 跟随标记
  followMark?: string

  id?: number

  // 运行状态
  status?: number
  // 故障状态
  error?: number
  // 远程状态
  remote?: number
  // 本地状态
  local?: number
  // 禁用状态
  disabled?: number

  // 双击事件
  onDblclick?: Function
  // 点击事件
  onClick?: Function
}

export interface PipeItem {
  name: string
  // 类型 初始化模型对应的 key
  type: string

  // 位置、旋转、缩放
  position?: XYZ
  rotation?: XYZ
  scale?: XYZ

  // 管路
  // 贴图重复次数[x,y0]
  map?: number[]
  // 绑定设备（管路关联设备。设备动则动,只要满足一个设备运行则执行）
  // [ [ 'LDB_1-1', 'FM_1-1' ], [ 'LDB_1-2', 'FM_1-1' ] ]
  bind?: (string | string[] | string[][])[]
  // 左
  left?: (string | string[] | string[][])[]
  // 右
  right?: (string | string[] | string[][])[]
}

export interface Extra {
  mixer: any
}

export type ThreeModelItem = {
  uuid: string
  visible: boolean
  _position_?: XYZ
  data?: ObjectItem
  extra?: Extra
  clear: Function
  element?: HTMLElement
  _isWarning_?: boolean

  [key: string]: any
} & THREE.Object3D

export interface StylePosition {
  left: number
  top: number
}
