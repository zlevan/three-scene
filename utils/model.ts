import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import CONFIG from '../config'
import type { Color } from '../types/color'
import type { XYZ, StylePosition } from '../types/model'

// 获取位置、大小、缩放参数
export const get_P_S_R_param = (model, item, s: number = 1) => {
  // 模型本身
  const _position_ = model.position,
    _rotation_ = model.rotation,
    _scale_ = model.scale

  // 设备配置
  const position = item.position || { x: 0, y: 0, z: 0 },
    rotation = item.rotation || { x: 0, y: 0, z: 0 },
    scale = item.scale || { x: 1, y: 1, z: 1 }

  // 判断配置角度倍数系数（小于 2 相当于使用的 180 度的倍数）
  const PInsx = Math.abs(rotation.x) < 2 ? 1 : 180
  const PInsy = Math.abs(rotation.y) < 2 ? 1 : 180
  const PInsz = Math.abs(rotation.z) < 2 ? 1 : 180

  return {
    position: [_position_.x + position.x, _position_.y + position.y, _position_.z + position.z],
    rotation: [
      _rotation_.x + (Math.PI / PInsx) * rotation.x,
      _rotation_.y + (Math.PI / PInsy) * rotation.y,
      _rotation_.z + (Math.PI / PInsz) * rotation.z
    ],
    scale: [_scale_.x * s * scale.x, _scale_.y * s * scale.y, _scale_.z * s * scale.z]
  }
}

// 克隆材质
const cloneMaterial = list => {
  return list.map(el => {
    if (el.children && el.children.length > 0) {
      el.children = cloneMaterial(el.children)
    } else if (el.material) {
      if (el.material instanceof Array) {
        el.material = el.material.map(el => el.clone())
      } else {
        el.material = el.material.clone()
      }
    }
    return el
  })
}

// 深克隆 // 防止数据感染
export const deepClone = obj => {
  let model = obj.clone()
  model.children = cloneMaterial(model.children)
  return model
}

// 材质替换
export const replaceMaterial = (child: any, color: string | number = 0x676565, meshNames: string[], envMap?): void => {
  const { type, name } = child
  // 灯光
  if (type.indexOf('Light') > -1) {
  }
  if (CONFIG.mesh.receiveShadowName.some(it => name.indexOf(it) > -1)) {
    // 接收阴影
    child.traverse(el => {
      if (el.isMesh) {
        el.receiveShadow = true
      }
    })
  } else if (meshNames.some(it => name.indexOf(it) > -1)) {
    setMaterialColor(child, color)
  } else if (child.isMesh) {
    envMap && (child.material.envMap = envMap)
    child.castShadow = true
  }
}

// 获取颜色数组
export const getColorArr = (color: Color) => {
  let arr: (number | string)[] = []
  if (Array.isArray(color)) {
    arr = color
  } else if (color != void 0) {
    arr = [color]
  }
  return arr
}

// 设置材质颜色
export const setMaterialColor = (e: any, color: number | string): void => {
  e.traverse(el => {
    if (el.isMesh) {
      if (Array.isArray(el.material)) {
        el.material.forEach(mt => {
          mt.color.set(color)
        })
      } else {
        el.material.color.set(color)
      }
    }
  })
}

// 相机入场动画
export const cameraInSceneAnimate = (
  camera: InstanceType<typeof THREE.PerspectiveCamera>,
  to: XYZ,
  at: XYZ
): Promise<InstanceType<typeof THREE.PerspectiveCamera>> => {
  camera.lookAt(at)
  return new Promise(resolve => {
    new TWEEN.Tween(camera.position)
      .to(to, 1000)
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {
        // 设置相机对焦位置
        camera.lookAt(at)
      })
      .onComplete(() => {
        resolve(camera)
      })
  })
}

// 获取 3 维平面位置
export const getPlanePosition = (
  dom: HTMLElement,
  object,
  camera: InstanceType<typeof THREE.PerspectiveCamera>
): StylePosition => {
  let halfw = dom.clientWidth / 2
  let halfh = dom.clientHeight / 2
  let position = object.position.clone()
  const scale = object.scale
  position.y += scale.x / 2
  // 平面坐标
  let vector = position.project(camera)
  // 二维坐标 (没有加偏移量因为 css 父级又相对定位)
  let pos = {
    left: vector.x * halfw + halfw,
    top: -vector.y * halfh + halfh
  }
  return pos
}
