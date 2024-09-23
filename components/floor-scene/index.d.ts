import type { Fog, Render, Camera, Controls } from '../../types/index'
import type { XYZ, ModelItem, ObjectItem } from '../../types/model'
import type { IndexDB } from '../../types/indexdb'

export declare interface Config {
  // 场景相机位置
  to: XYZ
  // 场景中心点/相机聚焦位置
  target: XYZ
  // 楼层展开模式
  // UD -> up-down | BA -> before-after
  floorExpandMode: 'UD' | 'BA'
  // 楼层展开间距
  floorExpandMargin: number
  // 楼层展开后隐藏其他模型
  floorExpandHiddenOther: boolean
  // 楼层展开的 索引(楼层类型列表索引)
  floorExpandIndex: number
  // 楼层展开是否改变视角
  floorExpandChangeViewAngle: boolean
  // 返回
  back: Function
  // 加载
  load: Function
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

  // 数据库
  indexDB?: Partial<IndexDB>

  // 相机
  camera?: Partial<Camera>
  // 雾化
  fog?: Partial<Fog>
  // 渲染
  render?: Partial<Render>
  // 控制器
  controls?: Partial<Controls>

  // 模型(场景加载类型对应的模型)
  models: ModelItem[]
  // 配置
  config?: Partial<Config>
  // 对象列表（设备列表）
  objects: ObjectItem[]
  // DOT 类型 key 默认: 'DOT'
  dotKey?: string
  // dot 点位展示严格模式（设备运行时展示） 默认: true
  dotShowStrict?: boolean

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]

  // 获取颜色回调
  getColorCall?: (obj: ObjectItem) => string | number | undefined
  // 格式化数据方法
  formatObject: (list: ObjectItem[]) => ObjectItem[]
  // DOT 点位更新对象回调方法
  dotUpdateObjectCall?: (obj: ObjectItem, list: ThreeModelItem[]) => UpdateDotReturn
  // 更新对象回调方法
  updateObjectCall?: (obj: ObjectItem) => Partial<UpdateFnReturn>
  // 随机更新对象回调方法
  randomUpdateObjectCall?: (obj: ObjectItem) => Partial<UpdateFnReturn> | undefined

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]
  // 动态模型类型(有动画)
  animationModelType?: string[]
  // 楼层模块类型
  floorModelType?: string[]
  // 绘制名称立体文字的类型
  textModelType?: string[]
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType?: string[]

  // 主体变色
  mainBodyChangeColor?: boolean
  // 主体网格名称 默认: [ '主体' ]
  mainBodyMeshName?: string[]
}

export declare interface ExtendOptions {
  onDblclick: (e) => void
  onClickLeft: (e?) => void
  onClickRight: (e) => void
  animateCall: () => void
}
