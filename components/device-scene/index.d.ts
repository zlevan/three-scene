import type {
  Fog,
  Render,
  Camera,
  Controls,
  Grid,
  Axes,
  Cruise,
  AmbientLight,
  DirectionalLight
} from '../../types/index'
import type { XYZ, ModelItem, ObjectItem, PipeItem } from '../../types/model'
import type { IndexDB } from '../../types/indexdb'
import type { Colors, ColorObject } from '../../types/color'

interface StatusOffsetItem {
  [key: string]: Record<'position' | 'rotation', XYZ>
}

export declare interface StatusOffset {
  TEXT: StatusOffsetItem
  WARNING: StatusOffsetItem
  STATUS: StatusOffsetItem
  DISABLED: StatusOffsetItem
}

export declare interface Config {
  // 场景相机位置
  to: XYZ
  // 场景中心点/相机聚焦位置
  target: XYZ
  // 返回
  back: Function
  // 加载
  load: Function
}

// 更新对象返回
export declare interface UpdateFnReturn {
  // 大于 0 则运行
  status: number
  // 大于 0 则故障
  error: number
  // 大于 0 则远程
  remote: number
  // 大于 0 则本地
  local: number
  // 大于 0 则禁用
  disabled: number
}

// 更新点位返回
export declare interface UpdateDotReturn {
  // 显示
  show: boolean
  // 值
  value?: number
}

// 改变材质配置
export declare interface ChangeMaterialOpts {
  // 类型、
  type: string
  // 模型、
  el: any
  // 颜色对象、
  colorObj: ColorObject
  // 颜色、
  color: Color
  // 动画暂停状态、
  paused: boolean
  // 故障状态
  error: boolean
  // 远程状态
  remote: boolean
  // 本地状态
  local: boolean
  // 本地状态
  disabled: boolean
}

export declare interface Props {
  // 是否开发环境（开发环境下开启测试功能）
  devEnv?: boolean
  // 基础地址（加载资源地址）
  baseUrl: string
  // draco 解压文件地址
  dracoUrl?: string
  // 背景色
  bgColor?: string | number
  // 天空背景
  skyCode?: string
  // 背景图片
  bgUrl?: string | string[]

  // 环境
  env?: string
  // 缩放
  scale?: number

  // 颜色
  colors?: import('../../types/utils').DeepPartial<Colors>

  // 数据库
  indexDB?: Partial<IndexDB>

  // 相机
  camera?: Partial<Camera>
  // 巡航
  cruise?: Partial<Cruise>
  // 雾化
  fog?: Partial<Fog>
  // 渲染
  render?: Partial<Render>
  // 控制器
  controls?: Partial<Controls>
  // 网格
  grid?: Partial<Grid>
  // 坐标轴
  axes?: Partial<Axes>
  // 环境光
  ambientLight?: Partial<AmbientLight>
  // 平行光
  directionalLight?: Partial<DirectionalLight>

  // 模型(场景加载类型对应的模型)
  models: ModelItem[]
  // 配置
  config?: Partial<Config>
  // 对象列表（设备列表）
  objects: ObjectItem[]
  // 管路列表
  pipes?: PipeItem[]
  // DOT 类型 key 默认: 'DOT'
  dotKey?: string
  // dot 点位展示严格模式（设备运行时展示） 默认: true
  dotShowStrict?: boolean

  // 文字、状态标记偏差值
  statusOffset?: import('../../types/utils').DeepPartial<StatusOffset>

  // 获取颜色回调
  getColorCall?: (obj: ObjectItem) => string | number | undefined
  // 格式化数据方法
  formatObject?: (list: ObjectItem[]) => ObjectItem[]
  // DOT 点位更新对象回调方法
  dotUpdateObjectCall?: (obj: ObjectItem, list: ThreeModelItem[]) => UpdateDotReturn
  // 更新对象回调方法
  updateObjectCall?: (obj: ObjectItem, isRandom: boolean) => Partial<UpdateFnReturn>

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]
  // 颜色状态类型（需要根据状态改变颜色的类型） 默认： [ 'FM' ]
  colorModelType?: string[]
  // 动态模型类型(有动画)
  animationModelType?: string[]
  // 绘制名称立体文字的类型
  textModelType?: string[]
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType?: string[]

  // 文字变色（根据模型状态且带动画）
  textChangeColor?: boolean
  // 主体变色 （动画模型）
  mainBodyChangeColor?: boolean
  // 主体网格名称 默认: [ '主体' ]
  mainBodyMeshName?: string[]
  // 主体排除模型类型，防止主体网格名称和动态变色的名称相同
  mainBodyExcludeType?: string[]
}

export declare interface ExtendOptions {
  onDblclick: (e) => void
  onClickLeft: (e?) => void
  onClickRight: (e) => void
  animateCall: () => void
}
