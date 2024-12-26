import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import type { Options } from '../../types/open-the-door'
import { deepMerge } from '../../utils'
import { ThreeModelItem } from '../../types/model'

type Params = import('../../types/utils').DeepPartial<Options>

// 开门 open-the-door
export const useOpenTheDoor = () => {
  let _options = {
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
    rightMatch: '右'
  }

  // 双开横推门
  const dubleHorizontal = (scene: THREE.Scene, options: Params) => {
    const { propertyName, value, scale, axle, isOpen, leftMatch, rightMatch } = deepMerge(
      _options,
      options
    )

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
      if (rpos.z === rMove) return resolve(dobj)
      new TWEEN.Tween(lpos)
        .to(
          {
            [axle]: left.__position__[axle] + (dobj.__open__ ? scale : 0)
          },
          1000 * 1
        )
        .delay(0)
        .start()
      new TWEEN.Tween(rpos)
        .to(
          {
            [axle]: rMove
          },
          1000 * 1
        )
        .delay(0)
        .start()
        .onComplete(() => {
          resolve(dobj)
        })
    })
  }

  return {
    dubleHorizontal
  }
}
