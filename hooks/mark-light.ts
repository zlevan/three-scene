import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { deepMerge, random } from '../utils'

export declare interface Options {
  pointTextureUrl: string
  circleTextureUrl: string
  lightTextureUrl: string
  factor: number
  color: string | number
}

export declare type Params = import('../types/utils').DeepPartial<Options>

// 光柱
export const useMarkLight = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 标记点的图片url
      pointTextureUrl: new URL('three-scene/assets/imgs/texttures/point.png', import.meta.url).href,
      // 光圈的URL
      circleTextureUrl: new URL('three-scene/assets/imgs/texttures/circle.png', import.meta.url).href,
      // 光柱的URL
      lightTextureUrl: new URL('three-scene/assets/imgs/texttures/light.png', import.meta.url).href,
      // 系数
      factor: 1,
      color: 0x00ffff
    },
    options
  )

  // 纹理加载器
  const textureLoader = new THREE.TextureLoader()

  // 创建底部光点
  const createBottomPoint = () => {
    // 标记点：几何体，材质，
    const geometry = new THREE.PlaneGeometry(3, 3)
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(_options.pointTextureUrl),
      color: _options.color,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false //禁止写入深度缓冲区数据
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.renderOrder = 1
    mesh.name = '底部光点'
    // 缩放
    const scale = 0.3 * _options.factor
    mesh.scale.setScalar(scale)
    return mesh
  }

  // 创建光圈
  const createLightCircle = () => {
    // 标记点：几何体，材质，
    const geometry = new THREE.PlaneGeometry(3, 3)
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(_options.circleTextureUrl),
      color: _options.color,
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,
      depthWrite: false //禁止写入深度缓冲区数据
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.renderOrder = 2
    mesh.name = 'createLightHalo'
    // 缩放
    const scale = 0.5 * _options.factor
    mesh.scale.setScalar(scale)

    // 动画延迟时间
    const delay = random(0, 2000)
    // 动画：透明度缩放动画
    mesh.tween1 = new TWEEN.Tween({ scale: scale, opacity: 0 })
      .to({ scale: scale * 1.5, opacity: 1 }, 1000)
      .delay(delay)
      .onUpdate(params => {
        let { scale, opacity } = params
        mesh.scale.setScalar(scale)
        mesh.material.opacity = opacity
      })
    mesh.tween2 = new TWEEN.Tween({ scale: scale * 1.5, opacity: 1 })
      .to({ scale: scale * 2, opacity: 0 }, 1000)
      .onUpdate(params => {
        let { scale, opacity } = params
        mesh.scale.setScalar(scale)
        mesh.material.opacity = opacity
      })
    // 第一段动画完成后接第二段
    mesh.tween1.chain(mesh.tween2)
    // 第二段动画完成后接第一段
    mesh.tween2.chain(mesh.tween1)
    mesh.tween1.start()
    return mesh
  }

  // 创建光柱
  const createMarkLight = (position = [0, 0, 0], height = 10, options: Params = {}) => {
    _options = deepMerge(_options, options)
    const group = new THREE.Group()
    // 柱体的geo,6.19=柱体图片高度/宽度的倍数
    const geometry = new THREE.PlaneGeometry(height / 6.219, height)
    // 柱体旋转-90度，垂直于Z轴
    geometry.rotateX(-Math.PI / 2)
    // 柱体的z轴移动高度一半对齐中心点
    geometry.translate(0, 0, height / 2)
    // 柱子材质
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(_options.lightTextureUrl),
      color: _options.color,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })
    // 光柱01
    let light01 = new THREE.Mesh(geometry, material)
    light01.rotateX(Math.PI)
    light01.position.z = height
    // 渲染顺序
    light01.renderOrder = 3
    light01.name = '光柱 01'
    // 光柱02：复制光柱01
    let light02 = light01.clone()
    light02.name = '光柱 02'
    // 光柱02，旋转90°，跟 光柱01交叉
    light02.rotateZ(Math.PI / 2)

    // 底部光点
    const bottomPoint = createBottomPoint()
    // 光圈
    const circleLight = createLightCircle()

    // 将光柱和标点添加到组里
    group.add(light01, light02, bottomPoint, circleLight)
    group.position.set(...position)
    group.rotateX(Math.PI * 0.5)
    group.name = '光柱标记'
    return group
  }

  return {
    createMarkLight
  }
}
