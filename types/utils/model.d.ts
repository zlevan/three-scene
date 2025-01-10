import * as THREE from 'three'

import type { Color } from '../color'
import type { XYZ, StylePosition, ObjectItem, ThreeModelItem } from '../model'

// 获取位置、大小、缩放参数
export function get_P_S_R_param(
  model: any,
  item: ObjectItem,
  s?: number
): {
  position: number[]
  rotation: number[]
  scale: number[]
}

// 深克隆 // 防止数据感染
export function modelDeepClone<T>(obj: T): T

// 材质替换
export function replaceMaterial(
  child: any,
  color: string | number,
  meshNames: string[],
  envMap?: any
): void

// 获取颜色数组
export function getColorArr(color: Color): (string | number)[]

// 设置材质颜色
export function setMaterialColor(e: ThreeModelItem, color: number | string): void

// 相机入场动画
export function cameraInSceneAnimate<T>(camera: T, to: XYZ, at?: THREE.Vector3): Promise<T>

// 相机聚焦转场
export function cameraLookatAnimate<T>(camera: T, to: XYZ, target: THREE.Vector3): Promise<T>

// 相机于控制联动动画
export function cameraLinkageControlsAnimate<T>(
  controls: any,
  camera: T,
  to: XYZ,
  target: THREE.Vector3
): Promise<T>

// 创建精灵动画
export function createSpriteAnimate<T>(
  model: T,
  POS: number[],
  range?: number,
  duration?: number
): T

// 获取 3 维平面位置
export function getPlanePosition(
  dom: HTMLElement,
  object: ThreeModelItem,
  camera: THREE.PerspectiveCamera | any
): StylePosition

// 查找模型对象中包含指定属性的集合
export function findObjectsByHasProperty(
  children: any[],
  values: string[],
  property?: string
): ThreeModelItem[]

// 获取状态偏差值
export function getStatusOffset(
  key: string,
  item: ObjectItem,
  offset: any
): {
  position: XYZ
  rotation: XYZ
}

// 创建文字
export function createText(
  item: ObjectItem,
  fontParser: any,
  color: string | number,
  offset?: any
): THREE.Mesh & {
  _isText_: boolean
}

// 创建警告标识 key、数据、模型、光源半径、缩放
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

// 创建状态标识
export function createStatusMark<T>(
  item: ObjectItem,
  model: T,
  offset?: any,
  isDisabled?: boolean
): T
