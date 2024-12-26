import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import type { Options } from '../../types/open-the-door'
import { deepMerge } from '../../utils'
import { ThreeModelItem } from '../../types/model'

type Params = import('../../types/utils').DeepPartial<Options>

// 开门 open-the-door
export const useOpenTheDoor = () => {
  let _options: Options = {
    // 属性名
    propertyName: 'name',
    // 值
    value: '',
    // 开门大小
    scale: 10,
    // 坐标轴
    axle: 'z',
    // 是否打开(未传入则根据当前状态自动转换)
    isOpen: void 0,
    // 左门匹配名称
    leftMatch: '左',
    rightMatch: '右',

    // 动画时长
    duration: 1 * 1000,
    // 旋转角度
    angle: Math.PI * 0.5,
    // 自动关闭
    autoClose: true,
    // 延迟(自动关闭)
    delay: 10 * 1000
  }

  // 双开横推门
  const dubleHorizontal = (scene: THREE.Scene, options: Params) => {
    const {
      propertyName,
      value,
      scale,
      axle,
      isOpen,
      leftMatch,
      rightMatch,
      duration,
      autoClose,
      delay
    } = deepMerge(_options, options) as Options

    // 查找双开门分组
    const dobj = scene.getObjectByProperty(propertyName, value) as ThreeModelItem
    if (!dobj) {
      console.warn('未找到目标！')
      return Promise.reject()
    }

    // 左右门
    const left = dobj.children.find(el => el.name.indexOf(leftMatch) > -1) as ThreeModelItem
    const right = dobj.children.find(el => el.name.indexOf(rightMatch) > -1) as ThreeModelItem

    if (!left || !right) {
      console.warn('未找到双开门！')
      return Promise.reject()
    }

    if (autoClose) {
      // 清除定时器
      clearTimeout(dobj.__timer__)
    }

    const lpos = left.position
    const rpos = right.position
    // 当前状态无 则存储坐标
    if (dobj.__open__ == void 0) {
      left.__position__ = new THREE.Vector3().copy(lpos)
      right.__position__ = new THREE.Vector3().copy(rpos)
    }

    // 设置当前开门状态
    dobj.__open__ = isOpen !== void 0 ? isOpen : !dobj.__open__
    return new Promise(resolve => {
      const rMove = right.__position__[axle] + (dobj.__open__ ? -scale : 0)
      // 坐标不变则直接返回
      if (rpos[axle] === rMove) return resolve(dobj)
      new TWEEN.Tween(lpos)
        .to(
          {
            [axle]: left.__position__[axle] + (dobj.__open__ ? scale : 0)
          },
          duration
        )
        .delay(0)
        .start()
      new TWEEN.Tween(rpos)
        .to(
          {
            [axle]: rMove
          },
          duration
        )
        .delay(0)
        .start()
        .onComplete(() => {
          resolve(dobj)
        })

      if (autoClose) {
        // 延迟 自动关闭
        if (dobj.__open__) {
          dobj.__timer__ = setTimeout(() => {
            dubleHorizontal(scene, options)
          }, delay + duration)
        }
      }
    })
  }

  // 双旋转开门
  const dubleRotate = (scene: THREE.Scene, options: Params) => {
    const {
      propertyName,
      value,
      angle,
      axle,
      leftMatch,
      rightMatch,
      isOpen,
      duration,
      autoClose,
      delay
    } = deepMerge(_options, options) as Options

    // 查找双开门分组
    const dobj = scene.getObjectByProperty(propertyName, value) as ThreeModelItem
    if (!dobj) {
      console.warn('未找到目标！')
      return Promise.reject()
    }
    // 左右门
    const left = dobj.children.find(el => el.name.indexOf(leftMatch) > -1) as ThreeModelItem
    const right = dobj.children.find(el => el.name.indexOf(rightMatch) > -1) as ThreeModelItem

    if (!left || !right) {
      console.warn('未找到双开门！')
      return Promise.reject()
    }

    if (autoClose) {
      // 清除定时器
      clearTimeout(dobj.__timer__)
    }

    const lrote = left.rotation
    const rrote = right.rotation

    if (dobj.__open__ == void 0) {
      left.__rotation__ = new THREE.Euler().copy(lrote)
      right.__rotation__ = new THREE.Euler().copy(rrote)
    }
    // 设置当前开门状态
    dobj.__open__ = isOpen !== void 0 ? isOpen : !dobj.__open__

    return new Promise(resolve => {
      const rMove = right.__rotation__[axle] + (dobj.__open__ ? -angle : 0)
      // 坐标不变则直接返回
      if (rrote[axle] === rMove) return resolve(dobj)

      new TWEEN.Tween(left.rotation)
        .to(
          {
            [axle]: left.__rotation__[axle] + (dobj.__open__ ? angle : 0)
          },
          duration
        )
        .delay(0)
        .start()
      new TWEEN.Tween(right.rotation)
        .to(
          {
            [axle]: rMove
          },
          duration
        )
        .delay(0)
        .start()

      if (autoClose) {
        // 延迟 自动关闭
        if (dobj.__open__) {
          dobj.__timer__ = setTimeout(() => {
            dubleRotate(scene, options)
          }, delay + duration)
        }
      }
    })
  }

  return {
    dubleHorizontal,
    dubleRotate
  }
}
