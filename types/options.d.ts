export interface Fog {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 颜色
   */
  color: string | number

  /**
   * 相机可视最近距离
   */
  near: number

  /**
   * 相机可视最远距离
   */
  far: number
}

export interface Render {
  /**
   * 抗锯齿
   */
  antialias: boolean

  /**
   * 透明
   */
  alpha: boolean

  /**
   * 设置对数深度缓存
   */
  logarithmicDepthBuffer: boolean

  /**
   * 截图设置, true 时性能会下降
   */
  preserveDrawingBuffer: boolean
}

export interface Controls {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 自动旋转
   */
  autoRotate: boolean

  /**
   * 自动旋转速度
   */
  autoRotateSpeed: number

  /**
   * 阻尼(惯性)
   */
  enableDamping: boolean

  /**
   *  阻尼系数，鼠标灵敏度
   */
  dampingFactor: number

  /**
   * 视角平移（右键拖拽）
   */
  enablePan: boolean

  /**
   * 视角旋转
   */
  enableRotate: boolean

  /**
   * 视角缩放
   */
  enableZoom: boolean

  /**
   * 视角旋转角度上限
   */
  maxAzimuthAngle: number

  /**
   * 视角旋转角度下限
   */
  minAzimuthAngle: number

  /**
   * 视角最近距离
   */
  minDistance: number

  /**
   * 视角最远距离
   */
  maxDistance: number

  /**
   * 视角垂直角度下限
   */
  minPolarAngle: number

  /**
   * 视角垂直角度上限
   */
  maxPolarAngle: number

  /**
   * target 目标移动半径
   */
  maxTargetRadius: number

  /**
   * 旋转速度
   */
  rotateSpeed: number

  /**
   * 空间内平移/垂直平面平移
   */
  screenSpacePanning: boolean
}

export interface AmbientLight {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 环境光颜色
   */
  color: number | string

  /**
   * 环境光强度
   */
  intensity: number
}

export interface DirectionalLight {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 辅助器
   */
  helper: boolean

  /**
   * 灯光 1 坐标
   */
  position: number[]

  /**
   * 灯光 2 坐标
   */
  position2: number[]

  /**
   * 灯光 2 是否展示
   */
  light2: boolean

  /**
   * 灯光颜色
   */
  color: number | string

  /**
   * 灯光强度
   */
  intensity: number
}

export interface Camera {
  /**
   * 辅助器
   */
  helper: boolean

  /**
   * 最近距离
   */
  near: number

  /**
   * 最远距离
   */
  far: number

  /**
   * 是否为正交相机
   */
  orthogonal: boolean

  /**
   * 相机坐标
   */
  position: [number, number, number]
}

export interface Grid {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 透明度
   */
  opacity: number

  /**
   * 透明
   */
  transparent: boolean

  /**
   * 宽度
   */
  width: number

  /**
   * 网格等分数
   */
  divisions: number

  /**
   * 中心线颜色
   */
  centerLineColor: number | string

  /**
   * 网格颜色
   */
  gridColor: number | string

  /**
   * 网格交叉点
   */
  fork: boolean

  /**
   * 网格交叉点大小
   */
  forkSize: number

  /**
   * 网格交叉点颜色
   */
  forkColor: number | string
}

export interface Axes {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 大小
   */
  size: number
}

export interface Cruise {
  /**
   * 显示
   */
  visible: boolean

  /**
   * 激活(可识别键盘操作)
   */
  enabled: boolean

  /**
   * 运行中
   */
  runing: boolean

  /**
   * 巡航点位
   */
  points: number[][]

  /**
   * 巡航曲线张力
   */
  tension: number

  /**
   * 基础地址
   */
  baseUrl: string

  /**
   * 贴图地址
   */
  mapUrl: string

  /**
   * 贴图重复
   */
  repeat: number[]

  /**
   * 宽度
   */
  width: number

  /**
   * 巡航时速度
   */
  speed: number

  /**
   * 贴图材质动画滚动速度
   */
  mapSpeed: number

  /**
   * 巡航点偏差（距离巡航点的上下偏差）
   */
  offset: number

  /**
   * 系数
   */
  factor: number

  /**
   * 巡航分段数
   */
  segment: number

  /**
   * 索引
   */
  index: number

  /**
   * 辅助器
   */
  helper: boolean

  /**
   * 路径闭合
   */
  close: boolean

  /**
   * 自动巡航(可从动画函数执行机器人巡航)
   */
  auto: boolean

  /**
   * 管路模式
   */
  tube: boolean

  /**
   * 材质颜色
   */
  color: string | number

  /**
   *  半径 (管路模式未管路半径、平面模式为拐角半径)
   */
  radius: number

  /**
   * 路径分段
   */
  radialSegments: number

  /**
   * 一直显示路线（默认巡航中展示路线）
   */
  alway: boolean

  /**
   * 帧动画回调
   */
  animateBack:
    | ((position: any, lookAt: any, cruiseCurve: any, progress: number) => void)
    | undefined
}

export interface Options {
  /**
   * docment 容器
   */
  container: HTMLElement | string

  /**
   * 容器宽度
   */
  width: number

  /**
   * 容器高度
   */
  height: number

  /**
   * 基础地址（资源地址）
   */
  baseUrl: string

  /**
   * 场景缩放倍数（如大屏，缩放，二维坐标计算需要）
   */
  scale: number

  /**
   * 背景颜色
   */
  bgColor: number | string

  /**
   * 背景地址（图片）
   */
  bgUrl: string | string[]

  /**
   * 环境纹理文件地址（hdr 文件）
   */
  env: string

  /**
   * 雾化
   */
  fog: Fog

  /**
   * 渲染器
   */
  render: Render

  /**
   * 控制器
   */
  controls: Controls

  /**
   * 环境灯光
   */
  ambientLight: AmbientLight

  /**
   * 平行灯光
   */
  directionalLight: DirectionalLight

  /**
   * 相机
   */
  camera: Camera

  /**
   * 巡航
   */
  cruise: Cruise

  /**
   * 网格辅助器
   */
  grid: Grid

  /**
   * 坐标辅助器
   */
  axes: Axes
}

export type Params = import('./utils').DeepPartial<Options>
