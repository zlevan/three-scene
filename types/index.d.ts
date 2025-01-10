import * as THREE from 'three'
import * as TGPU from 'three/build/three.webgpu'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { XYZ } from './model'

declare type Camera = THREE.PerspectiveCamera & THREE.OrthographicCamera

declare type Controls = OrbitControls

/**
 * 场景
 * @example
 * ```typescript
 *  const scene = new Scene()
 * ```
 */
export class Scene {
  // 配置
  options: import('./options').Options
  // 容器
  container: HTMLElement
  // 场景
  scene: THREE.Scene & TGPU.Scene
  // 渲染器
  renderer: THREE.WebGLRenderer
  // 基础相机
  baseCamera: Camera
  // 巡航相机
  cruiseCamera?: Camera
  // 巡航组
  cruiseGroup?: THREE.Group
  // 控制器
  controls?: Controls
  // 网格
  grid?: THREE.GridHelper
  // 动画 id
  animationId?: number
  // 静态属性
  static total: number
  // 鼠标
  pointer: {
    tsp: number
    isClick: boolean
  }

  // 时间
  clock?: THREE.Clock

  /**
   * 场景构造器
   * @param { object } options
   */
  constructor(options: import('./options').Params)

  /**
   * 场景相机
   */
  readonly camera: Camera

  /**
   * 初始化
   */
  init(): void

  /**
   * 运行（执行帧动画）
   */
  run(): void

  /**
   * 帧循环函数
   */
  loop(): void

  /**
   * 帧动画函数
   */
  animate(): void

  /**
   * 初始化模型（自定义模型）
   */
  initModel(): void

  /**
   * 模型动画
   */
  modelAnimate(): void

  /**
   * 创建渲染器
   */
  createRender(): THREE.WebGLRenderer

  /**
   * 初始化渲染器
   */
  initRenderer(): THREE.WebGLRenderer

  /**
   * 初始化灯光
   */
  initLight(): void

  /**
   * 创建平行光
   */
  createDirectionalLight(): THREE.DirectionalLight

  /**
   * 初始化相机
   * @return { Camrea } camera 相机
   */
  initCamera(): Camera

  /**
   * 初始化控制器
   * @return { Controls } controls 控制器
   */
  initControls(): Controls

  /**
   * 初始化巡航
   */
  initCruise(): void

  /**
   * 初始化网格辅助器
   */
  initGrid(): void

  /**
   * 初始化坐标辅助器
   */
  initAxes(): void

  /**
   * 创建地面
   * @param { number } sizeX x轴宽度
   * @param { number } sizeY y轴宽度
   * @param { number | string } color 材质颜色
   */
  createGround(sizeX?: number, sizeY?: number, color?: number | string): THREE.Mesh

  /**
   * 创建时间对象
   */
  createClock(): void

  /**
   * 设置巡航点位
   * @param { number[] } points 点位二维数组
   */
  setCruisePoint(points: number[][]): void

  /**
   * 创建巡航组
   */
  createCruise(): void

  /**
   * 巡航启动或关闭
   * @param { boolean } close 是否关闭
   */
  toggleCruise(close?: boolean): void

  /**
   * 开启或关闭巡航深度测试
   * @param { boolean } depthTest 深度测试
   */
  toggleCruiseDepthTest(depthTest?: boolean): void

  /**
   * 设置缩放
   * @param { number } s 缩放倍数
   */
  setScale(s: number): void

  /**
   * 设置环境纹理
   * @param { string } hdrUrl hdr 文件地址
   */
  setEnvironment(hdrUrl: string): void

  /**
   * 设置背景图
   * @param { string | string [] } bgUrl 背景图地址
   */
  setBgTexture(bgUrl: string | string[]): void

  /**
   * 设置背景色
   * @param { number | string } color 背景色
   */
  setBgColor(color: number | string): void

  /**
   * 绑定事件
   */
  bindEvent(): void

  /**
   * 鼠标双击事件
   * @param { MouseEvent } e
   */
  onDblclick(e: MouseEvent): void

  /**
   * 鼠标按下事件
   * @param { PointerEvent } e
   */
  onPointerDown(e: PointerEvent): void

  /**
   * 鼠标移动事件
   * @param { PointerEvent } e
   */
  onPointerMove(e: PointerEvent): void

  /**
   * 鼠标弹起事件
   * @param { PointerEvent } e
   */
  onPointerUp(e: PointerEvent): void

  /**
   * 导出图片( preserveDrawingBuffer 需设置为 true)
   */
  exportImage(): void

  /**
   * 获取场景坐标
   * @return { object } res
   * @return { THREE.Vector3 } res.position 相机坐标
   * @return { THREE.Vector3 } res.target 控制器中心点
   */
  getPosition(): {
    position: THREE.Vector3
    target: THREE.Vector3
  }

  /**
   * 判断相机位置是否移动
   * @param { XYZ } to 目标坐标
   * @param { number } distance 间距（判断是否移动的 差异间距）
   */
  isCameraMove(to: XYZ, distance?: number): boolean

  /**
   * 控制保存
   */
  controlSave(): void

  /**
   * 控制重置
   */
  controlReset(): void

  /**
   * 添加对象到场景
   * @param { ...any[] } object 需要添加的对象，可传多个
   */
  addObject(...object: any[]): void

  /**
   * 获取有效的目标点 并设置中心点
   * @param { object } config
   * @param { XYZ } config.to 相机坐标
   * @param { XYZ } config.target 控制器中心点
   * @param { XYZ } to 相机坐标
   * @param { XYZ } target 控制器中心点
   * @param { XYZ } defaultTo 默认相机坐标
   */
  getValidTargetPosition(
    config: {
      to?: XYZ
      target?: XYZ
    },
    to?: XYZ,
    target?: XYZ,
    defaultTo?: XYZ
  ): XYZ

  /**
   * 重置画布大小
   */
  resize(): void

  /**
   * 停止动画
   */
  stopAnimate(): void

  /**
   * 清除对象
   * @param { any } obj 需要清理的对象
   */
  clear(obj: any): void

  /**
   * 销毁对象
   * @param { any } obj 需要销毁的对象
   */
  disposeObj(obj: any): void

  /**
   * 销毁场景
   */
  dispose(): void
}
