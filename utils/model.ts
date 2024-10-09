import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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

// 查找指定名称的材质对象集合
export const findMaterial = (children, names: string[]) => {
  let list: any[] = []
  if (!children || !children.length) return []
  function find(data) {
    data.forEach(el => {
      const name = el.name
      if (typeof name == 'string' && names.some(t => name.indexOf(t) > -1)) {
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

// 获取偏差值
const TYPE_KEYS = CONFIG.keys
export const getDeviationConfig = (item, cr: string | number = 0xffffff) => {
  const type = item.type
  let size = 10, // 模型、字体大小
    color = cr, // 字体颜色
    txPos = { x: 0, y: 0, z: 0 }, // 字体 xyz 坐标（相对模型的中心点）
    txRot = { x: 0, y: 0, z: 0 }, // 字体 xyz 旋转大小
    warnPos = { x: 0, y: 0, z: 0 }, // 警告 xyz 坐标（相对模型的中心点）
    statusPos = { x: 0, y: 0, z: 0 }, // 状态 xyz 坐标（相对模型的中心点）
    disabledPos = { x: 0, y: 0, z: 0 } // 禁用 xyz 坐标（相对模型的中心点）
  switch (type) {
    case TYPE_KEYS.TEXT: // 文字
      break

    case TYPE_KEYS.JSQ: // 集水器
      txPos.y = 10
      txPos.x = -20
      txRot.y = 270
      warnPos.y = 62
      break

    case TYPE_KEYS.LDB: // 冷冻泵
    case TYPE_KEYS.LQB: // 冷却泵
      txPos.z = type === TYPE_KEYS.LDB ? 0 : 60
      txPos.x = type === TYPE_KEYS.LDB ? -60 : 0
      txRot.y = type === TYPE_KEYS.LDB ? 0 : -90
      warnPos.y = 45
      statusPos.x = -0.4
      statusPos.y = 46.7
      statusPos.z = -15.7
      disabledPos.x = -0.4
      disabledPos.y = 34
      disabledPos.z = 12.5
      break

    case TYPE_KEYS.XBC: // 蓄冰槽
    case TYPE_KEYS.LXJ: // 离心机
      txPos.y = 16
      txPos.z = 50
      txRot.x = -20
      warnPos.y = 78
      statusPos.x = 36
      statusPos.y = 67
      statusPos.z = 42
      disabledPos.x = -25
      disabledPos.y = 85
      disabledPos.z = 20
      break

    case TYPE_KEYS.LGJ: // 螺杆机
    case TYPE_KEYS.LGJ_2: // 双头螺杆机
    case TYPE_KEYS.LGJ_3: // 三机头螺杆机
    case TYPE_KEYS.LGJ_4: // 四机头螺杆机
      txPos.y = 16
      txPos.z = 50
      txRot.x = -20
      warnPos.y = 78
      statusPos.x = -40
      statusPos.y = 64
      statusPos.z = 42
      disabledPos.x = 0
      disabledPos.y = 75
      disabledPos.z = 20
      break

    case TYPE_KEYS.LQT: // 冷却塔
      txPos.x = -60
      warnPos.y = 85
      statusPos.x = -27.6
      statusPos.y = 70
      statusPos.z = -25.2
      disabledPos.x = -27.6
      disabledPos.y = 70
      disabledPos.z = 25.2
      break

    case TYPE_KEYS.GL: // 锅炉
      txPos.x = 83
      txPos.y = 2
      warnPos.y = 125
      statusPos.y = 125
      break

    case TYPE_KEYS.BSHRQ: // 板式换热器
      size = 12
      txPos.y = 8
      txPos.z = 33
      warnPos.y = 105
      statusPos.y = 105
      break

    case TYPE_KEYS.BSHLQ: // 板式换热器-制冷
      txPos.y = 16
      txPos.z = 40
      warnPos.y = 88
      statusPos.x = -43
      statusPos.y = 90
      statusPos.z = -20
      break

    case TYPE_KEYS.FLRB: // 风冷热泵
      txPos.x = 50
      txPos.y = 2
      warnPos.y = 123
      statusPos.y = 123
      break

    case TYPE_KEYS.FJY_X: // 风机-右
    case TYPE_KEYS.FJZ_X: // 风机-左
      size = 6
      txPos.y = 80
      txPos.z = 30
      warnPos.y = 80
      statusPos.y = 80
      break

    case TYPE_KEYS.FJY: // 风机-右
    case TYPE_KEYS.FJZ: // 风机-左
      size = 6
      txPos.y = 103
      warnPos.y = 110
      statusPos.y = 110
      break

    case TYPE_KEYS.FM: // 阀门
    case TYPE_KEYS.XFM: // 阀门
      break
  }

  // 字体配置
  let font = item.font || {}
  // 字体坐标
  let fontPOs = font.position || {}
  if (fontPOs) {
    Object.keys(fontPOs).forEach(key => {
      txPos[key] = fontPOs[key]
    })
  }
  // 字体角度
  let fontRot = font.rotation || {}
  if (fontRot) {
    Object.keys(fontRot).forEach(key => {
      txRot[key] = fontRot[key]
    })
    ;(txRot.x = (Math.PI / 180) * txRot.x), (txRot.y = (Math.PI / 180) * txRot.y), (txRot.z = (Math.PI / 180) * txRot.z)
  }

  font.size && (size = font.size)
  font.color && (color = font.color)

  return { size, color, txPos, txRot, warnPos, statusPos, disabledPos }
}

// 创建文字
export const createText = (item: ObjectItem, fontParser, color?: string | number) => {
  if (!fontParser) return
  const obj = getDeviationConfig(item, color)
  // 文字
  let textGeo = new TextGeometry(item.name || '', {
    font: fontParser,
    size: obj.size || 5,
    depth: 0,
    curveSegments: 12, // 曲线分段
    bevelThickness: 1, // 斜面厚度
    bevelSize: 0.1, // 斜角大小
    bevelEnabled: true // 斜角
  })
  const rotation = obj.txRot
  textGeo.rotateX(rotation.x)
  textGeo.rotateY(rotation.y)
  textGeo.rotateZ(rotation.z)

  const position = obj.txPos
  // 计算边界
  textGeo.computeBoundingBox()
  // 计算垂直算法
  textGeo.computeVertexNormals()
  let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
  let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)
  let material = new THREE.MeshPhongMaterial({
    color: obj.color != void 0 ? obj.color : 0xffffff,
    flatShading: !true
  })
  let mesh = new THREE.Mesh(textGeo, material)
  mesh.castShadow = true
  mesh.position.set((position.x || 0) - offsetX, position.y || 0, (position.z || 0) - offsetZ)
  mesh.name = 'text'
  return mesh
}

// 创建警告标识 key、数据、模型、光源半径、缩放
export const createWarning = (key, item: ObjectItem, model, radius = 100, s: number = 1) => {
  if (!model) return
  const obj = getDeviationConfig(item).warnPos
  let group = new THREE.Group()
  // 深克隆
  let warningSigns = deepClone(model)
  warningSigns.scale.set(s, s, s)
  warningSigns.position.set(obj.x, obj.y, obj.z)
  group.add(warningSigns)

  // 创建光源
  // 点光源 (颜色、强度、距离、衰减) 衰减！！！不要默认值
  let light = new THREE.PointLight(0xc20c00, 8, radius, 0)
  // const sphere = new THREE.SphereGeometry( 1, 16, 8 )
  // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) )

  light.name = '灯光'
  light.position.y = obj.y + 30
  group.add(light)
  group.name = key

  // 警告标识动画
  let mixer = new THREE.AnimationMixer(group)

  // 创建颜色关键帧对象
  // 0 时刻对应颜色 1，0，0   .25时刻对应颜色 1，1，1 .75...
  let colorKF = new THREE.KeyframeTrack('红色.material.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0])
  let lightKF = new THREE.KeyframeTrack('灯光.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0])
  // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
  let scaleTrack = new THREE.KeyframeTrack('警告标识.scale', [0, 0.5, 1], [1, 1, 1, 1.2, 1.2, 2, 1, 1, 1])
  // 多个帧动画作为元素创建一个剪辑 clip 对象，命名‘warning_’，持续时间1
  let clip = new THREE.AnimationClip(`warning_`, 1, [colorKF, lightKF, scaleTrack])
  let action = mixer.clipAction(clip)
  // 暂停
  action.paused = true
  // 播放
  action.play()

  // 隐藏
  group.visible = false
  return {
    group,
    action,
    mixer
  }
}
