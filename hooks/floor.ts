import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import { deepMerge } from '../utils'
import type { Options } from '../types/floor'

type Params = import('../types/utils').DeepPartial<Options>

// 楼层 floor
export const useFloor = (options: Params = {}) => {
  const _options = deepMerge(
    {
      mode: 'BA',
      margin: 50
    },
    options
  )

  const floorAnimate = (list, index, getFllowMarkFn) => {
    // 执行目标是否存在
    const isExist = index !== void 0 && index > -1

    const { margin, mode } = _options
    for (let i = 0; i < list.length; i++) {
      const el = list[i]
      // 换算间距
      const pos = el._position_
      let k = i - (!isExist ? i : index)
      const cy = k * margin

      // 原始坐标+偏移
      let ty = (pos.y ?? 0) + cy
      let tz = index == i ? (pos.z ?? 0) + margin : pos.z ?? 0

      // 当前点击目标已经移动过，则收起
      const isMove =
        index === i &&
        ((mode === 'UD' && ty === el.position.y) || (mode === 'BA' && tz === el.position.z))
      if (isMove) {
        ty = pos.y ?? 0
        tz = pos.z ?? 0
      }

      // 判断模式
      // UD 上下
      // BA 前后
      // 移动目标为模型坐标则不执行动画
      if (mode === 'UD') {
        if (el.position.y === ty) continue
      } else if (mode === 'BA') {
        if (el.position.z === tz) continue
      }

      // 标记跟随模型
      if (el.data?.mark) {
        const mark = el.data.mark
        const items = getFllowMarkFn(mark)
        // 偏移
        let offset = index == i ? margin : 0
        if (isMove) {
          offset = 0
        }
        fllowModelAnimate(mode, items, cy, offset)
      }

      new TWEEN.Tween(el.position)
        .to(
          {
            y: mode === 'UD' ? ty : el.position.y,
            z: mode === 'BA' ? tz : el.position.z
          },
          500
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
    }
  }

  // 跟随模型动画
  const fllowModelAnimate = (mode: string, items: any[], cy: number, cz: number) => {
    if (items.length === 0) return

    items.forEach(el => {
      const pos = el._position_
      const ty = mode == 'UD' ? (pos.y ?? 0) + cy : pos.y ?? 0
      const tz = mode == 'BA' ? (pos.z ?? 0) + cz : pos.z ?? 0
      new TWEEN.Tween(el.position)
        .to(
          {
            y: ty,
            z: tz
          },
          500
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
    })
  }

  return {
    floorAnimate
  }
}
