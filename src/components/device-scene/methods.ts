import * as THREE from 'three'

import * as ThreeScene from '../../index'
import { useRaycaster, useCSS2D, CSS2DRenderer } from '../../hooks/index'

import type { XYZ, ObjectItem } from '../../types/model'
import type { Config, ExtendOptions } from '.'

import DEFAULTCONFIG from '../../config'

const { raycaster, pointer, update: raycasterUpdate } = useRaycaster()
const { initCSS2DRender, createCSS2DDom } = useCSS2D()
export class DeviceThreeScene extends ThreeScene.Scene {
  // 设备集合
  deviceGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 管路集合
  pipeGroup?: InstanceType<typeof THREE.Group>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof CSS2DRenderer>
  // 扩展参数
  extend: Partial<ExtendOptions>
  constructor(
    options: ConstructorParameters<typeof ThreeScene.Scene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    this.createClock()

    this.addDeviceGroup()
    this.addDotGroup()
    this.addPipeGroup()
    this.bindEvent()
  }

  // 添加设备组
  addDeviceGroup() {
    const group = new THREE.Group()
    group.name = '设备组'
    this.deviceGroup = group
    this.addObject(group)
  }

  // 清除场景设备
  clearDevice() {
    if (this.deviceGroup) {
      this.disposeObj(this.deviceGroup)
    }
    this.addDeviceGroup()
    this.clearDot()
    this.clearPipe()
  }

  // 添加设备
  addDevice(...obj: any[]) {
    if (this.deviceGroup) {
      this.deviceGroup.add(...obj)
    }
  }

  // 添加点位组
  addDotGroup() {
    const group = new THREE.Group()
    group.name = '点位组'
    this.scene.add(group)
    this.dotGroup = group
  }

  // 清除场景点位
  clearDot() {
    if (this.dotGroup) {
      this.disposeObj(this.dotGroup)
    }
    this.addDotGroup()
  }

  // 添加点位
  addDot(item: ObjectItem, clickBack: (e: Event, label: any) => void) {
    const pos = item.position
    const { size, color } = item.font || {}
    const { x = 0, y = 0, z = 0 } = pos || {}
    const label = createCSS2DDom({
      name: `
        <div class="bg"></div>
        <span class="inner" style="${
          size != void 0 ? `font-size: ${typeof size === 'string' ? size : size + 'px'};` : ''
        } ${color != void 0 ? `color: ${color}` : ''}"></span>
      `,
      className: 'dot-2D-label',
      position: [x, y, z],
      onClick: clickBack
    })
    label.name = item.name
    label.data = item
    this.dotGroup?.add(label)
    return label
  }

  // 添加管路组
  addPipeGroup() {
    const group = new THREE.Group()
    group.name = '管路组'
    this.scene.add(group)
    this.pipeGroup = group
  }

  // 添加管路
  addPipe(...obj: any[]) {
    if (this.pipeGroup) {
      this.pipeGroup.add(...obj)
    }
  }

  // 清除管路组
  clearPipe() {
    if (this.pipeGroup) {
      this.disposeObj(this.pipeGroup)
    }
    this.addPipeGroup()
  }

  // 双击
  onDblclick(e: MouseEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e as PointerEvent, dom, scale)

    if (this.deviceGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.deviceGroup, this.pipeGroup] as any
      const interscts = raycaster.intersectObjects(objects)
      if (interscts.length) {
        const obj = interscts[0].object
        const object = this.findParentGroupGroup(obj)
        if (!object) return
        if (typeof this.extend?.onDblclick === 'function') this.extend.onDblclick(object)
      }
    }
  }

  // 移动
  onPointerMove(e: PointerEvent) {
    this.checkIntersectObjects(e)
  }

  // 弹起
  onPointerUp(e: PointerEvent) {
    super.onPointerUp(e)

    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < DEFAULTCONFIG.rightClickBackDiffTime
    if (e.button == 2) {
      // console.log('你点了右键')
      if (isClick && typeof this.extend?.onClickRight === 'function') this.extend.onClickRight(e)
    } else if (e.button == 0) {
      // console.log('你点了左键')
      isClick && this.checkIntersectObjects(e)
    } else if (e.button == 1) {
      // console.log('你点了滚轮')
    }
  }

  // 检查交叉几何体
  checkIntersectObjects(e: PointerEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)
    let isClick = e.type == 'pointerdown' || e.type == 'pointerup'
    const objects =
      this.deviceGroup?.children.filter((it: any) => it.visible && it._isAnchor_) || []

    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    raycaster.setFromCamera(pointer, this.camera)
    let interscts = raycaster.intersectObjects(objects, isClick)
    dom.style.cursor = interscts.length > 0 ? 'pointer' : 'auto'
    if (!isClick) {
      return
    }

    if (interscts.length) {
      const object = interscts[0].object
      if (!object) return
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft(object)
    } else {
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft()
    }
  }

  // 查找父级组合
  findParentGroupGroup(object: any) {
    const _find = (obj: any) => {
      let parent = obj.parent
      if (!parent) {
        return
      }
      if (parent && (parent._isDevice_ || parent._isPipe_)) {
        return parent
      }
      return _find(parent)
    }
    return _find(object)
  }

  modelAnimate() {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    // 设备动画
    if (this.deviceGroup && this.deviceGroup.children.length) {
      let delta = this.clock?.getDelta()
      this.deviceGroup.children.forEach((el: any) => {
        let data = el.data
        if (!data) return
        let extra = el.extra
        // 运行状态等于设定值则更新
        if (extra && (data?.status ?? 0) > 0) {
          extra.mixer.update(delta)
        }

        // 故障状态等于设定值则更新
        const warning = el[DEFAULTCONFIG.meshKey.warning]
        if (warning && (data?.error || 0) > 0) {
          warning.mixer.update(delta)
        }
      })
    }

    // 管路动画
    if (this.pipeGroup && this.pipeGroup.children.length) {
      this.pipeGroup.children.forEach((el: any) => {
        const pipe = el[DEFAULTCONFIG.meshKey.pipe]
        if (pipe) {
          const data = el.data
          const bind = data.bind || []
          // 运行中的设备
          const runingDevices = (this.deviceGroup?.children || [])
            .filter(
              (item: any) => item.data && item.data.deviceCode && (item.data?.status ?? 0) > 0
            )
            .map((it: any) => it.data)
          // 绑定的运行设备
          const bingDevices = this.findFilterDevice(bind, runingDevices)

          // 长度大于 0 则运行
          const run = bingDevices.length > 0
          let step = 0.01
          // 绑定动画方向左右
          if (data.left && data.right) {
            const { left, right } = data
            const isRight = this.findFilterDevice(right, bingDevices).length > 0
            const isLeft = this.findFilterDevice(left, bingDevices).length > 0
            step = isLeft && isRight ? 0 : isRight ? -0.01 : 0.01
          }
          pipe.forEach((ms: any) => {
            if (run) {
              ms.material.map.offset.y -= step
            }
            ms.material.opacity = !!run ? 0.3 : 0
          })
        }
      })
    }
  }

  // 查找满足条件运行设备
  findFilterDevice = (filters: any[], devices: any[]) => {
    if (filters.length == 0 || devices.length == 0) return []
    let runDev: ObjectItem[] = []
    filters.forEach(item => {
      if (item instanceof Array) {
        let s: ObjectItem[] = []
        const d = item.filter(it => {
          if (it instanceof Array) {
            const ar = devices.filter(t => it.includes(t.deviceCode))
            if (ar.length) {
              ar.forEach(t => {
                if (!s.includes(t)) s.push(t)
              })
            }
            return ar.length > 0
          }
          const a = devices.find(t => t.deviceCode == it)
          if (a && !s.includes(a)) s.push(a)
          return !!a
        })
        if (d.length == item.length) {
          runDev = runDev.concat(s)
        }
      } else {
        const d = devices.find(it => it.deviceCode == item)
        if (d) runDev.push(d)
      }
    })
    return runDev
  }

  // 获取动画目标点
  getAnimTargetPos(config: Partial<Config>, _to?: XYZ, _target?: XYZ) {
    if (!this.controls) return
    const to = _to || config.to || { x: -104, y: 7, z: 58 }
    const target = _target || config.target || { x: 0, y: 0, z: 0 }
    // 中心点位
    this.controls.target.set(target.x, target.y, target.z)
    return to
  }

  // 获取所有对象
  getAll() {
    return this.deviceGroup?.children.concat(this.dotGroup?.children || []) || []
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender.setSize(width, height)
  }

  dispose() {
    this.disposeObj(this.deviceGroup)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.pipeGroup)

    this.clock = void 0
    // @ts-ignore
    this.css2DRender = void 0
    this.deviceGroup = void 0
    this.dotGroup = void 0
    this.pipeGroup = void 0
    this.extend = {}
    super.dispose()
  }
}
