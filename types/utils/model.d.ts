import * as THREE from 'three'

import type { Color } from '../color'
import type { XYZ, StylePosition, ObjectItem, ThreeModelItem } from '../model'

/**
 * 获取位置、大小、缩放参数
 * @param { any } model 模型
 * @param { ObjectItem } item 对象数据
 * @param { number } s 缩放比例
 */
export function get_P_S_R_param(
  model: any,
  item: ObjectItem,
  s?: number
): {
  position: number[]
  rotation: number[]
  scale: number[]
}

/**
 * 模型深克隆 防止数据感染
 * @param { any } model 模型
 */
export function modelDeepClone<T>(model: T): T

/**
 * 材质替换
 * @param { ThreeModelItem } modelEl 模型元素
 * @param { string | number } color 材质颜色
 * @param { string[] } meshNames 需要改变颜色的网格名称
 * @param { any } envMap 环境纹理
 */
export function replaceMaterial(
  modelEl: ThreeModelItem,
  color: string | number,
  meshNames: string[],
  envMap?: any
): void

/**
 * 获取颜色数组
 * @param { Color } color  不统一的颜色数据
 */
export function getColorArr(color: Color): (string | number)[]

/**
 * 设置材质颜色
 * @param { ThreeModelItem } modelEl 模型元素
 * @param { string | number } color 材质颜色
 */
export function setMaterialColor(modelEl: ThreeModelItem, color: number | string): void

/**
 * 相机入场动画
 * @param { any } camera 相机
 * @param { XYZ } to 目标坐标
 * @param { THREE.Vector3} at lookat 坐标
 * @return { Promise }
 */
export function cameraInSceneAnimate<T>(camera: T, to: XYZ, at?: THREE.Vector3): Promise<T>

/**
 * 相机聚焦转场
 * @param { any } camera 相机
 * @param { XYZ } to 目标坐标
 * @param { THREE.Vector3 } target 控制器中心点
 * @returns { Promise }
 */
export function cameraLookatAnimate<T>(camera: T, to: XYZ, target: THREE.Vector3): Promise<T>

/**
 * 相机于控制联动动画
 * @param { any } controls 控制器
 * @param { any } camera 相机
 * @param { XYZ } to 目标坐标
 * @param { THREE.Vector3 } target 控制器中心点
 * @returns { Promise }
 * @example ```ts
 * cameraLinkageControlsAnimate(controls, camera, { x: 1, y: 1, z: 1 }, new THREE.Vector3(0, 0, 0))
 * ```
 */
export function cameraLinkageControlsAnimate<T>(
  controls: any,
  camera: T,
  to: XYZ,
  target: THREE.Vector3
): Promise<T>

/**
 * 创建精灵动画
 * @param { any } spriteModel 精灵模型
 * @param { number[] } POS 坐标
 * @param { number } range 动画移动范围
 * @param { number } duration 动画持续时间
 */
export function createSpriteAnimate<T>(
  spriteModel: T,
  POS: number[],
  range?: number,
  duration?: number
): T

/**
 * 获取三维空间对应的平面位置
 * @param { HTMLElement } dom 三维空间容器
 * @param { ThreeModelItem } object 模型对象
 * @param { any } camera 相机
 * @returns { StylePosition }
 */
export function getPlanePosition(
  dom: HTMLElement,
  object: ThreeModelItem,
  camera: THREE.PerspectiveCamera | any
): StylePosition

/**
 * 查找模型列表中包含指定属性的集合
 * @param { ThreeModelItem[] } objects 查找的模型对象列表
 * @param { string[] } values 查找值列表
 * @param { string } property 属性名称
 */
export function findObjectsByHasProperty(
  objects: ThreeModelItem[],
  values: string[],
  property?: string
): ThreeModelItem[]

/**
 * 获取状态偏差值(设备等自定义偏差)
 * @param { string } key 自定义对应 key
 * @param { ObjectItem } item 对象数据
 * @param { any } offset 偏差数据
 * @returns { object } 坐标、旋转角度
 */
export function getStatusOffset(
  key: string,
  item: ObjectItem,
  offset: any
): {
  position: XYZ
  rotation: XYZ
}

/**
 * 创建文字
 * @param { ObjectItem } item 对象数据
 * @param { any } fontParser 字体分析器
 * @param { string | number } color 文字颜色
 * @param { any } offset 偏差值
 * @returns { THREE.Mesh }
 */
export function createText(
  item: ObjectItem,
  fontParser: any,
  color: string | number,
  offset?: any
): THREE.Mesh & {
  _isText_: boolean
}

/**
 * 创建警告标识
 * @param { string } key 加载模型对应 key
 * @param { ObjectItem } item 模型对象数据
 * @param { any } model 模型
 * @param { any } offset 偏差数据
 * @param { number } radius 光源半径
 * @param { number } s 缩放比例
 * @returns { object } 警告组、动画、动画混合器
 */
export function createWarning(
  key: string,
  item: ObjectItem,
  model: any,
  offset?: any,
  radius?: number,
  s?: number
): {
  group: THREE.Group & {
    _isWarning_: boolean
  }
  action: THREE.AnimationAction
  mixer: THREE.AnimationMixer
}

/**
 * 创建状态标识
 * @param { ObjectItem } item 模型对象数据
 * @param { any } model 模型
 * @param { any } offset 偏差数据
 * @param { boolean } isDisabled 禁用
 */
export function createStatusMark<T>(
  item: ObjectItem,
  model: T,
  offset?: any,
  isDisabled?: boolean
): T
