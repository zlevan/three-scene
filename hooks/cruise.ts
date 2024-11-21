import * as THREE from 'three'
import { PathGeometry, PathPointList } from 'three.path'

import { deepMerge, getUrl } from '../utils'
import type { Cruise as Options } from '../types/index'
export declare type Params = import('../types/utils').DeepPartial<Options>

// 巡航
export const useCruise = () => {
  // 曲线
  let cruiseCurve: InstanceType<typeof THREE.CatmullRomCurve3>
  // 贴图
  let texture: InstanceType<typeof THREE.TextureLoader>
  // 辅助眼睛
  let eye: InstanceType<typeof THREE.Mesh>

  let _options: Options = {
    visible: true,
    // 激活(可识别键盘操作)
    enabled: false,
    // 运行中
    runing: false,
    // 辅助
    helper: false,
    // 点位
    points: [],
    // 分段
    segment: 2,
    // 曲线张力
    tension: 0,
    // 基础地址
    baseUrl: '',
    // 贴图地址
    mapUrl: new URL('three-scene/assets/imgs/texttures/arrow.png', import.meta.url).href,
    // 贴图重复
    repeat: [0.1, 1],
    // 宽度
    width: 15,
    // 动画速度
    speed: 1,
    // 贴图速度
    mapSpeed: 0.006,
    //  巡航偏差
    offset: 10,
    // 系数
    factor: 1,
    // 索引
    index: 0,
    // 自动巡航
    auto: false,
    // 帧动画回调
    animateBack: void 0
  }

  const createCruise = (options: Params = {}, renderer) => {
    // 默认参数
    _options = deepMerge(_options, options)

    const { points, tension, mapUrl, baseUrl, repeat, width, helper } = _options

    const newPoints: InstanceType<typeof THREE.Vector3>[] = []
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      newPoints.push(new THREE.Vector3(p[0], p[1], p[2]))
    }
    // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
    // 曲线类型：centripetal、chordal和catmullrom
    cruiseCurve = new THREE.CatmullRomCurve3(newPoints, true, 'catmullrom', tension ?? 0)
    cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(), true, 'catmullrom', tension ?? 0)
    const group = new THREE.Group()

    texture = new THREE.TextureLoader().load(getUrl(mapUrl, baseUrl), tx => {
      // 贴图在水平方向上允许重复
      tx.wrapS = THREE.RepeatWrapping
      tx.repeat.x = repeat[0]
      tx.repeat.y = repeat[1]
      // 向异性
      tx.anisotropy = renderer.capabilities.getMaxAnisotropy()
    })

    // 材质
    const mat = new THREE.MeshPhongMaterial({
      map: texture,
      opacity: 0.5,
      transparent: true,
      // depthWrite: false,
      depthTest: !false,
      blending: THREE.AdditiveBlending
    })

    // 向量
    const up = new THREE.Vector3(0, 1, 0)
    const pathPoints = new PathPointList()
    pathPoints.set(getAllPoints(), 5, 1, up, false)

    const geometry = new PathGeometry()
    geometry.update(pathPoints, {
      width: width,
      arrow: false
    })

    const mesh = new THREE.Mesh(geometry, mat)
    group.add(mesh)
    group.name = 'cruise'

    if (helper) {
      createHelper(group, newPoints)
    }
    group.renderOrder = 99
    return group
  }

  // 辅助
  const createHelper = (group, points) => {
    eye = new THREE.Mesh(
      new THREE.SphereGeometry(2),
      new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.8, depthTest: false, transparent: true })
    )
    group.add(eye)

    const geo = new THREE.BufferGeometry().setFromPoints(points.concat(points[0]))
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff, opacity: 1, depthTest: false, transparent: true })
    const mesh = new THREE.Line(geo, material)
    group.add(mesh)

    const tubeGeometry = new THREE.TubeGeometry(cruiseCurve, 100, _options.width / 2, 3, true)
    const tubeMat = new THREE.MeshLambertMaterial({
      color: 0xff00ff,
      opacity: 0.1,
      depthTest: false,
      transparent: true
    })
    const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMat)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0ff0,
      opacity: 0.3,
      wireframe: true,
      depthTest: false,
      transparent: true
    })
    const wireframe = new THREE.Mesh(tubeGeometry, wireframeMaterial)
    tubeMesh.add(wireframe)
    group.add(tubeMesh)
  }

  // 长度
  const getCruiseLen = () => (_options.segment ?? 2) * 1000

  // 所有点位
  const getAllPoints = () => cruiseCurve?.getPoints(getCruiseLen())

  // 偏移坐标
  const getOffsetPoint = (offset, pos) => {
    return new THREE.Vector3(pos.x, pos.y + offset, pos.z)
  }

  // 更新参数
  const updateCruise = (options: Params = {}) => {
    // 默认参数
    _options = deepMerge(_options, options)
  }

  // 巡航动画
  const cruiseAnimate = camera => {
    if (!camera) return
    if (!cruiseCurve) return
    const { mapSpeed, speed, factor, enabled, runing, offset, helper, auto, animateBack } = _options
    if (texture) texture.offset.x -= mapSpeed

    // 非自动、停止或非激活
    if (!auto && (!runing || !enabled)) return

    // 自动、激活且运行
    if (auto || (runing && enabled)) _options.index += factor * speed

    const looptime = getCruiseLen()
    const t = (_options.index % looptime) / looptime

    const oft = 0.001
    let ts = t + oft
    if (ts > 1) ts = ts - 1

    const pos = cruiseCurve.getPointAt(ts)
    if (helper && eye) {
      const nPos = getOffsetPoint(offset, pos)
      eye.position.copy(nPos)
    }

    const _pos = getOffsetPoint(offset, cruiseCurve.getPointAt(t))
    if (!auto || (runing && enabled)) {
      camera.position.copy(_pos)
      const at = getOffsetPoint(offset, pos)
      camera._lookAt_ = at
      camera.lookAt(at)
    }

    if (typeof animateBack === 'function') animateBack(_pos, pos, cruiseCurve, t)
  }

  const onKeyDown = e => {
    if (!_options.enabled) return
    const keyCode = e.keyCode
    switch (keyCode) {
      // 前进
      case 38:
      case 87:
        if (_options.runing) {
          _options.factor *= 1.5
          if (_options.factor > 10) _options.factor = 10
        } else {
          _options.index += 5
        }
        break
      // 后退
      case 83:
      case 40:
        if (!_options.runing) {
          _options.index -= 5
          if (_options.index < 0) {
            _options.index = getCruiseLen()
          }
        }
        break
    }
  }

  const onKeyUp = e => {
    if (!_options.enabled) return
    _options.factor = 1
    const keyCode = e.keyCode
    switch (keyCode) {
      // 暂停
      case 32:
        _options.runing = !_options.runing
        break
      // 前进
      case 38:
      case 87:
        if (!_options.runing) {
          _options.index += 10
        }
        break
      // 后退
      case 83:
      case 40:
        if (!_options.runing) {
          _options.index -= 10
          if (_options.index < 0) {
            _options.index = getCruiseLen()
          }
        }
        break
    }
  }

  const bindEvent = () => {
    window.addEventListener('keydown', onKeyDown, false)
    window.addEventListener('keyup', onKeyUp, false)
  }

  const removeEvent = () => {
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('keydown', onKeyDown)
  }

  return {
    createCruise,
    updateCruise,
    cruiseAnimate,
    bindEvent,
    removeEvent
  }
}
