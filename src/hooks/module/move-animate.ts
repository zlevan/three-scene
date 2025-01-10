import * as THREE from 'three'
import type { Options } from '../../../types/move-animate'
import type { XYZ } from '../../../types/model'

// 移动动画 move-animate
export const useMoveAnimate = () => {
  // 曲线
  let cruiseCurve: InstanceType<typeof THREE.CatmullRomCurve3>

  const _options: Options = {
    // 动画索引
    index: 0,
    // 总长度
    length: 0,
    // 运行中
    runing: false,
    // 模型
    model: void 0,
    // 速度
    speed: 1,
    // 结束回调
    endCallback: void 0,
    // 运行中回调
    rungingCall: void 0
  }

  const createMove = (
    model: any,
    moveTo: InstanceType<typeof THREE.Vector3>,
    rungingCall?: (pos: XYZ, stop: () => void) => void,
    endCallback?: (pos: XYZ) => void
  ) => {
    const pos = model.position

    // 求正切值
    const angle = Math.atan2(-moveTo.z + pos.z, moveTo.x - pos.x)
    model.rotation.y = Math.PI * 0.5 + angle

    // 长度
    const distance = pos.distanceTo(moveTo)
    let len = Math.floor(distance / _options.speed)
    if (len < 2) len = 2

    const points = [pos, moveTo]
    cruiseCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0)
    cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(len), false, 'catmullrom', 0)

    _options.model = model
    _options.index = 0
    _options.length = len
    _options.rungingCall = rungingCall
    _options.endCallback = endCallback

    _options.runing = true
  }

  // 所有点位
  const getAllPoints = (len: number) => cruiseCurve?.getPoints(len)

  // 获取进度坐标
  const getProgressPosition = (index: number) => {
    let t = index / _options.length
    if (t > 1) t = 1
    else if (t < 0) t = 0
    return cruiseCurve.getPointAt(t)
  }

  // 停止 后退
  const stop = (retreat: boolean = true) => {
    _options.runing = false
    if (retreat) {
      const index = _options.index - 1
      _options.model.position.copy(getProgressPosition(index))
    }
  }

  // 动画
  const moveAnimate = (factor = 1) => {
    if (!_options.runing) return
    _options.index += factor
    let t = _options.index / _options.length
    if (t > 1) t = 1
    const pos = cruiseCurve.getPointAt(t)
    _options.model.position.copy(pos)

    if (t >= 1) {
      _options.runing = false
      if (typeof _options.endCallback === 'function') _options.endCallback(pos)
    } else {
      if (typeof _options.rungingCall === 'function') _options.rungingCall(pos, stop)
    }
  }

  return {
    createMove,
    moveAnimate
  }
}
