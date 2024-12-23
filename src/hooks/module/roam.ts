import * as THREE from 'three'

import type { Options } from '../../types/roam'
import { deepMerge } from '../../utils'

type Params = import('../../types/utils').DeepPartial<Options>

const getOpts = () => ({
  // 运行中
  runing: false,
  // 分段
  segment: 2,
  // 闭合
  close: true,
  // 曲线张力
  tension: 0,
  // 视角偏差
  offset: 0,
  // 点位
  points: [],
  // 系数
  factor: 1,
  // 移动速度
  speed: 1,
  // 索引
  index: 0,
  // 帧动画回调
  animateBack: void 0
})

// 漫游 roam
export const useRoam = () => {
  // 曲线
  let cruiseCurve: InstanceType<typeof THREE.CatmullRomCurve3> | undefined

  let _options: Options = getOpts()

  const createRoam = (options: Params = {}) => {
    if (cruiseCurve) return
    // 默认参数
    _options = deepMerge(getOpts(), options)

    const { points, tension, close } = _options

    const newPoints: InstanceType<typeof THREE.Vector3>[] = []
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      newPoints.push(new THREE.Vector3(p[0], p[1], p[2]))
    }
    // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
    // 曲线类型：centripetal、chordal和catmullrom
    cruiseCurve = new THREE.CatmullRomCurve3(newPoints, close, 'catmullrom', tension ?? 0)
    cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(), close, 'catmullrom', tension ?? 0)
  }

  const reset = (options: Params) => {
    cruiseCurve = void 0
    createRoam(options)
  }

  // 所有点位
  const getAllPoints = () => cruiseCurve?.getPoints(getCruiseLen())

  // 长度
  const getCruiseLen = () => (_options.segment ?? 2) * 1000

  // 偏移坐标
  const getOffsetPoint = (offset: number, pos: InstanceType<typeof THREE.Vector3>) => {
    return new THREE.Vector3(pos.x, pos.y + offset, pos.z)
  }

  // 更新参数
  const updateRoam = (options: Params = {}) => {
    // 默认参数
    _options = deepMerge(_options, options)
  }

  // 暂停
  const pause = () => {
    _options.runing = false
  }

  // 播放
  const play = () => {
    _options.runing = true
  }

  // 获取状态
  const getStatus = () => _options.runing

  // 执行漫游
  const executeRoam = (camera: any, controls: any) => {
    if (!camera || !controls) return
    if (!cruiseCurve) return
    const { runing, offset, factor, speed, animateBack } = _options
    if (!runing) return

    _options.index += factor * speed

    const looptime = getCruiseLen()
    const t = (_options.index % looptime) / looptime

    const oft = 0.01
    let ts = t + oft
    if (ts > 1) ts = ts - 1

    const pos = cruiseCurve.getPointAt(ts)
    const _pos = getOffsetPoint(offset, cruiseCurve.getPointAt(t))

    // 视角偏差
    const at = getOffsetPoint(offset, pos)

    controls.target = at
    camera._lookAt_ = at
    camera.lookAt(controls.target)

    if (typeof animateBack === 'function') animateBack(_pos, pos, cruiseCurve, t)
  }

  return {
    createRoam,
    updateRoam,
    executeRoam,
    pause,
    play,
    reset,
    getStatus
  }
}
