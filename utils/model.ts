import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import { deepMerge } from '.'
import CONFIG from '../config'
import type { Color } from '../types/color'
import type { XYZ, StylePosition, ObjectItem } from '../types/model'

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
const cloneMaterial = el => {
  if (el.material instanceof Array) {
    el.material = el.material.map(mat => mat.clone())
  } else {
    el.material = el.material.clone()
  }
}

// 深克隆 // 防止数据感染
export const deepClone = obj => {
  let model = obj.clone()
  if (obj.isMesh || obj.isSprite) {
    cloneMaterial(obj)
  }
  model.traverse(el => {
    if (el.isMesh) {
      cloneMaterial(el)
    }
  })
  return model
}

// 材质替换
export const replaceMaterial = (
  child: any,
  color: string | number = 0x676565,
  meshNames: string[],
  envMap?
): void => {
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
    child.receiveShadow = true
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
      el.castShadow = true
      el.receiveShadow = true
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
  camera._lookAt_ = at
  return new Promise(resolve => {
    new TWEEN.Tween(camera.position)
      .to(to, 1000)
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {
        // 设置相机对焦位置
        camera.lookAt(at)
        camera._lookAt_ = at
      })
      .onComplete(() => {
        resolve(camera)
      })
  })
}

// 相机聚焦转场
export const cameraLookatAnimate = (
  camera: InstanceType<typeof THREE.PerspectiveCamera>,
  to: XYZ,
  target: InstanceType<typeof THREE.Vector3>
) => {
  new TWEEN.Tween(target)
    .to(to, 1000)
    .easing(TWEEN.Easing.Quadratic.In)
    .start()
    .onUpdate(pos => {
      // 设置相机对焦位置
      camera.lookAt(pos)
      camera._lookAt_ = pos
    })
}

// 创建精灵动画
export const createSpriteAnimate = (model, POS, range = 1, duration: number = 10) => {
  // 创建动画
  // 创建对象的关键帧数据
  let times = [0, duration / 2, duration]
  let values = [
    ...POS, // 0
    POS[0],
    POS[1] + range,
    POS[2], // 5
    ...POS // 10
  ]
  let posTrack = new THREE.KeyframeTrack('sprite.position', times, values)
  let clip = new THREE.AnimationClip('sprite_up_down', duration, [posTrack])

  const mixer = new THREE.AnimationMixer(model)
  const action = mixer.clipAction(clip)
  // 暂停
  // action.paused = true
  // 动画速度
  action.timeScale = 5
  // 播放
  action.play()
  // 记录数据
  model.__action__ = action
  model.__mixer__ = mixer
  return model
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

// 查找模型对象中包含指定属性的集合
export const findObjectsByHasProperty = (children, values: string[], property: string = 'name') => {
  let list: any[] = []
  if (!children || !children.length) return []
  function find(data) {
    data.forEach(el => {
      const name = el[property]
      if (typeof name == 'string' && values.some(t => name.indexOf(t) > -1)) {
        list.push(el)
      }
      if (el.children) {
        find(el.children)
      }
    })
  }
  find(children)
  return list
}

// 获取状态偏差值
const STATUS_OFFSET = CONFIG.statusOffset
export const getStatusOffset = (key, item, offset = {}) => {
  const type = item.type
  const defOffset = STATUS_OFFSET[key] || {}
  const obj = offset[type] || defOffset[type] || {}

  // 坐标
  let position = deepMerge({ x: 0, y: 0, z: 0 }, obj.position || {})
  // 角度
  let rotation = deepMerge({ x: 0, y: 0, z: 0 }, obj.rotation || {})

  // 角度转换
  ;(rotation.x = (Math.PI / 180) * rotation.x),
    (rotation.y = (Math.PI / 180) * rotation.y),
    (rotation.z = (Math.PI / 180) * rotation.z)
  return {
    position,
    rotation
  }
}

// 创建文字
export const createText = (
  item: ObjectItem,
  fontParser,
  color: string | number = 0xffffff,
  offset?
) => {
  const obj = getStatusOffset('TEXT', item, offset)
  let font = item.font || {}
  // 文字
  let textGeo = new TextGeometry(item.name || '', {
    font: fontParser,
    size: font.size || 10,
    depth: 0,
    curveSegments: 12, // 曲线分段
    bevelThickness: 1, // 斜面厚度
    bevelSize: 0.1, // 斜角大小
    bevelEnabled: true // 斜角
  })
  const rot = obj.rotation
  textGeo.rotateX(rot.x)
  textGeo.rotateY(rot.y)
  textGeo.rotateZ(rot.z)

  const pos = obj.position
  // 计算边界
  textGeo.computeBoundingBox()
  // 计算垂直算法
  textGeo.computeVertexNormals()
  let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
  let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)
  let material = new THREE.MeshPhongMaterial({
    color: font.color != void 0 ? font.color : color,
    flatShading: !true
  })
  let mesh = new THREE.Mesh(textGeo, material)
  mesh.castShadow = true
  mesh.position.set((pos.x || 0) - offsetX, pos.y || 0, (pos.z || 0) - offsetZ)
  mesh.name = 'text'
  mesh._isText_ = true
  return mesh
}

// 创建警告标识 key、数据、模型、光源半径、缩放
export const createWarning = (
  key,
  item: ObjectItem,
  model,
  offset?,
  radius = 100,
  s: number = 1
) => {
  if (!model) return
  const obj = getStatusOffset('WARNING', item, offset)
  let group = new THREE.Group()
  // 深克隆
  let warningSigns = deepClone(model)
  warningSigns.scale.set(s, s, s)

  // 位置
  const pos = obj.position
  warningSigns.position.set(pos.x, pos.y, pos.z)

  // 角度
  const rot = obj.rotation
  warningSigns.rotation.set(rot.x, rot.y, rot.z)
  group.add(warningSigns)

  // 创建光源
  // 点光源 (颜色、强度、距离、衰减) 衰减！！！不要默认值
  let light = new THREE.PointLight(0xc20c00, 8, radius, 0)
  // const sphere = new THREE.SphereGeometry( 1, 16, 8 )
  // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) )

  light.name = '灯光'
  light.position.y = pos.y + 30
  group.add(light)
  group.name = key

  // 警告标识动画
  let mixer = new THREE.AnimationMixer(group)

  // 创建颜色关键帧对象
  // 0 时刻对应颜色 1，0，0   .25时刻对应颜色 1，1，1 .75...
  let colorKF = new THREE.KeyframeTrack(
    '红色.material.color',
    [0, 0.25, 0.75],
    [1, 0, 0, 1, 1, 0, 1, 0, 0]
  )
  let lightKF = new THREE.KeyframeTrack('灯光.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0])
  // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
  let scaleTrack = new THREE.KeyframeTrack(
    '警告标识.scale',
    [0, 0.5, 1],
    [1, 1, 1, 1.2, 1.2, 2, 1, 1, 1]
  )
  // 多个帧动画作为元素创建一个剪辑 clip 对象，命名‘warning_’，持续时间1
  let clip = new THREE.AnimationClip(`warning_`, 1, [colorKF, lightKF, scaleTrack])
  let action = mixer.clipAction(clip)
  // 暂停
  action.paused = true
  // 播放
  action.play()

  // 隐藏
  group.visible = false
  group._isWarning_ = true
  return {
    group,
    action,
    mixer
  }
}

// 创建状态标识
export const createStatusMark = (item, model, offset?, isDisabled?: boolean) => {
  if (!model) return
  const obj = getStatusOffset(isDisabled ? 'DISABLED' : 'STATUS', item, offset)
  // 深克隆
  let status = deepClone(model)

  // 位置
  const pos = obj.position
  status.position.set(pos.x, pos.y, pos.z)

  // 角度
  const rot = obj.rotation
  status.rotation.set(rot.x, rot.y, rot.z)

  status.visible = false
  status._isStatus_ = true
  return status
}
