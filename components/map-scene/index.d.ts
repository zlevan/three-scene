import type { Fog, Render, Camera, Controls, Grid, Axes, Cruise, DirectionalLight } from '../../types/index'

export declare interface Color {
  // 主色（地图面）
  main: number | string
  mainHover: number | string
  // 边(区域侧边)
  borderColor: number | string
  borderHoverColor: number | string
  // 浅色
  light: number | string
  lightHover: number | string
  // 波纹板
  plateColor: number | string
  plateLight: number | string
  // 线条(地图区块上下线条)
  line: number | string
  line2: number | string
  // 网格线
  gridColor: number | string
  // 网格交叉
  gridFork: number | string
  // 轮廓线
  outline: number | string
  // mark 颜色(光柱)
  markColor1: number | string
  markColor2: number | string
  // 飞线
  flyColor1: number | string
  flyColor2: number | string
  // 散点
  scatterColor1: number | string
  scatterColor2: number | string
}

export declare interface MapTexture {
  // 贴图
  map: string
  // 法线贴图
  normal: string
  // 边
  side: string

  // 背景外圈
  bgOutCircle: string
  // 背景内圈
  bgInnerCircle: string
}

export declare interface Config {
  // 地图深度
  depth: number
  // 地图缩放倍数
  scale: number
  // 右键间隔时间
  rightClickBackDiffTime: number

  // 区域 label
  areaLabel: boolean
  // 光柱
  markLight: boolean
  // 上下边框
  border: boolean
  // 地图背景
  mapBg: boolean
  // 地图柱状图
  mapBar: boolean

  // 地图贴图
  map: Partial<MapTexture>
}

export declare interface Flywire {
  path: string
  coords: number[][]
}

export declare interface BarItem {
  name: string
  value: number
  unit: string
}

export declare interface BarLabel {
  name: string
  className: string
  onClick: (e: Event) => void
}

export declare interface Scatter {
  coord: number[]
  name: string
}

export declare interface Props {
  // 是否开发环境（开发环境下开启测试功能）
  devEnv?: boolean
  // 基础地址（加载资源地址）
  baseUrl: string
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
  // 平行光
  directionalLight?: Partial<DirectionalLight>

  // 颜色
  color?: Partial<Color>
  // 配置
  config?: Partial<Config>

  // 波纹板
  corrugatedPlate?: boolean

  // 地图配置（省份）-地图 geo 数据
  mapJson: any
  // 轮廓配置
  outlineJson?: any
  // 飞线
  flywire?: Flywire[]
  // 柱状图
  barList?: Partial<BarItem>[]
  // 散点
  scatters?: Scatter[]

  // 柱状图 labe render
  barLabelRender?: (e: Partial<BarItem>) => Partial<BarLabel>
}
