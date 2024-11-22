import * as THREE from 'three'
import { PathGeometry, PathPointList } from 'three.path'

// 移动动画 move-animate
export const useMoveAnimate = () => {
  // 曲线
  let cruiseCurve: InstanceType<typeof THREE.CatmullRomCurve3>

  const options = {
    // 动画索引
    index: 0,
    // 总长度
    length: 0,
    // 运行中
    runing: false,
    // 模型
    model: null,
    // 速度
    speed: 1,
    // 结束回调
    endCallback: null,
    // 运行中回调
    rungingCall: null
  }

  const createMove = (model, moveTo, rungingCall?, endCallback?) => {
    const pos = model.position

    // 求正切值
    const angle = Math.atan2(-moveTo.z + pos.z, moveTo.x - pos.x)
    model.rotation.y = Math.PI * 0.5 + angle

    // 长度
    const distance = pos.distanceTo(moveTo)
    let len = Math.floor(distance / options.speed)
    if (len < 2) len = 2
    console.log(len)
    const points = [pos, moveTo]
    cruiseCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0)
    cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(len), false, 'catmullrom', 0)

    options.model = model
    options.index = 0
    options.length = len
    options.rungingCall = rungingCall
    options.endCallback = endCallback

    options.runing = true
  }

  // 所有点位
  const getAllPoints = len => cruiseCurve?.getPoints(len)

  // 动画
  const moveAnimate = (factor = 1) => {
    if (!options.runing) return
    options.index += factor
    let t = options.index / options.length
    if (t > 1) t = 1
    const pos = cruiseCurve.getPointAt(t)
    const { x, y, z } = pos
    options.model.position.set(x, y, z)

    if (t >= 1) {
      options.runing = false
      if (typeof options.endCallback === 'function') options.endCallback(pos)
    } else {
      if (typeof options.rungingCall === 'function') options.rungingCall(pos)
    }
  }

  return {
    createMove,
    moveAnimate
  }
}
