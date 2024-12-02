<template>
  <div :class="$style['floor-scene']">
    <!-- 操作按钮 -->
    <div class="scene-operation" v-if="devEnv">
      <div class="btn" @click="() => updateObject(true)">随机更新</div>
      <div class="btn" v-if="cruise.visible" @click="() => scene?.toggleCruise()">定点巡航</div>
      <div class="btn" @click="() => scene?.getPosition()">场景坐标</div>
      <div class="btn" @click="() => changeBackground(scene)">切换背景</div>
      <div class="btn" @click="() => scene?.controlReset()">控制器重置</div>
      <div class="btn" v-if="cruise.visible" @click="() => scene?.toggleCruiseDepthTest()">巡航深度</div>
    </div>
    <div :class="$style.container" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>

    <!-- 设备信息弹窗 -->
    <div :class="$style.dialog" v-if="dialog.show" :style="dialog.style">
      <slot name="dialog" :data="dialog.data" :title="dialog.title" :position="dialog.position"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '../loading/index.vue'
import { watch, ref, toRaw, withDefaults, onMounted, nextTick } from 'vue'
import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import { FloorThreeScene } from './methods'
import { colors } from './colors'
import * as UTILS from '../../utils/model'
import DEFAULTCONFIG from '../../config'

import { deepMerge } from '../../utils'

import type { ObjectItem, ThreeModelItem, XYZ } from '../../types/model'

const props = withDefaults(defineProps<import('./index').Props>(), {
  dracoUrl: '',
  dotKey: 'DOT',
  dotShowStrict: true,
  colors: () => ({}),
  camera: () => ({}),
  cruise: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  grid: () => ({}),
  axes: () => ({}),
  directionalLight: () => ({}),
  colorMeshName: () => [],
  anchorType: () => [],
  mainBodyMeshName: () => ['主体'],
  indexDB: () => ({
    cache: true
  })
})

const COLORS = deepMerge(colors, props.colors)

import { useBackground } from '../../hooks/background'
import { useModelLoader } from '../../hooks/model-loader'
import { useDialog } from '../../hooks/dialog'

const { change: changeBackground, load: backgroundLoad } = useBackground()
const { progress, loadModel, loadModels, getModel } = useModelLoader({
  baseUrl: props.baseUrl,
  dracoPath: props.dracoPath,
  basisPath: props.basisPath,
  colors: COLORS,
  colorMeshName: props.colorMeshName,
  indexDB: props.indexDB
})
const { dialog } = useDialog()

// 加载完成、更新、选择 anchorType 类型的模块、双击模型、点击 DOT 类型点位, 点击弹窗点位
const emits = defineEmits<{
  init: [scene: InstanceType<typeof FloorThreeScene>]
  loaded: []
  update: [list: ObjectItem[], isRandom?: boolean]
  select: [item: ObjectItem]
  dblclick: [item: ObjectItem]
  'click-dot': [item: ObjectItem, e: PointerEvent]
  'click-dialog-dot': [item: ObjectItem, pos: { left: number; top: number }]
}>()

const containerRef = ref()

const devEnv = props.devEnv
const options: ConstructorParameters<typeof FloorThreeScene>[0] = {
  baseUrl: props.baseUrl,
  bgUrl: props.bgUrl,
  env: props.env,
  bgColor: props.bgColor,
  camera: props.camera,
  cruise: props.cruise,
  fog: props.fog,
  render: props.render,
  grid: props.grid,
  controls: props.controls,
  axes: props.axes,
  directionalLight: props.directionalLight
}

let scene: InstanceType<typeof FloorThreeScene>

// 点位模式
watch(
  () => props.dotShowStrict,
  () => toggleDotVisible()
)

// 缩放
watch(
  () => props.scale,
  v => {
    scene?.setScale(v || 1)
  }
)

// 巡航
watch(
  () => props.cruise.points,
  v => {
    if (progress.isEnd) scene.setCruisePoint(v)
  }
)

// 对象列表
watch(
  () => props.objects,
  () => {
    if (progress.isEnd) assemblyScenario()
  }
)

// 点位隐现方式切换
const toggleDotVisible = () => {
  const list = scene.dotGroup.children
  for (let i = 0; i < list.length; i++) {
    const el = list[i]
    if (!el.data) continue
    const data = el.data
    // 数据参数
    let type = data.type
    // 点位
    if (type === props.dotKey) {
      updateDotVisible(el)
    }
  }
}

// 楼层动画
const floorAnimate = (index?: number) => {
  const floors = scene.getFloor()

  // 楼层列表为 0 则不执行
  if (floors.length === 0) return
  // 执行目标是否存在
  const isExist = index !== void 0 && index > -1
  // 楼层展开是否隐藏其他
  if (props.config?.floorExpandHiddenOther) {
    scene.hideOmitFloor(!isExist)
  }
  floors.forEach((el, i) => {
    // 换算间距
    const pos = el._position_
    let k = i - (!isExist ? i : index)
    const margin = props.config?.floorExpandMargin || 200
    const mode = props.config?.floorExpandMode || 'UD'
    const cy = k * margin
    const ty = (pos?.y ?? 0) + cy
    const tz = index == i ? (pos?.z ?? 0) + margin : pos?.z ?? 0

    // 判断模式
    // UD 上下
    // BA 前后
    // 移动目标为模型坐标则不执行动画
    if (mode === 'UD') {
      if (el.position.y === ty) return
    } else if (mode === 'BA') {
      if (el.position.z === tz) return
    }

    // 标记跟随模型
    if (el.data?.mark) {
      const mark = el.data.mark
      const items = scene.getFlowMark(mark)
      fllowModelAnimate(mode, items, cy, index == i ? margin : 0)
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
  })

  // 楼层展开是否改变视角
  if (!props.config?.floorExpandChangeViewAngle) return
  let to, target
  if (isExist) {
    const object = floors[index] || {}
    to = object.data?.to
    if (!!to) {
      target = object.data?.target || object._position_
    }
  }
  to = scene.getAnimTargetPos(props.config || {}, to, target)
  // 判断位置是否未移动
  if (!isCameraMove(to)) {
    UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target)
  }
}

// 判断相机位置是否移动
const isCameraMove = (to: XYZ) => {
  const pos = scene.camera.position
  // 坐标差距小于 1 则未移动
  return Math.abs(pos.x - to.x) < 1 && Math.abs(pos.y - to.y) < 1 && Math.abs(pos.z - to.z) < 1
}

// 跟随模型动画
const fllowModelAnimate = (mode: string, items: ThreeModelItem[], cy: number, cz: number) => {
  if (items.length === 0) return

  items.forEach(el => {
    const pos = el._position_
    const ty = mode == 'UD' ? (pos?.y ?? 0) + cy : pos?.y ?? 0
    const tz = mode == 'BA' ? (pos?.z ?? 0) + cz : pos?.z ?? 0
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

// 加载基础
const loadBase = async (item: ObjectItem) => {
  const { type, url = '', name } = item
  const model = await loadModel({ key: type, url, name, size: 0 })
  const { position: POS, scale: SCA, rotation: ROT } = UTILS.get_P_S_R_param(model, item)
  // 缩放
  model.scale.set(...SCA)
  // 摆放位置
  model.position.set(...POS)
  // 转换方位
  model.rotation.set(...ROT)
  model._isBase_ = true
  scene.addDevice(model)
  return Promise.resolve(model)
}

// 更新点位隐现
const updateDotVisible = (target: ThreeModelItem) => {
  const item = target.data as ObjectItem
  if (typeof props.dotUpdateObjectCall === 'function') {
    const res = props.dotUpdateObjectCall(item, scene.deviceGroup)
    if (typeof res === 'object') {
      Object.keys(res).forEach(key => {
        item[key] = res[key]
      })
    }
  } else {
    console.warn(new Error('未传人点位更新对象回调方法 dotUpdateObjectCall'))
  }

  target.visible = item.show || !props.dotShowStrict
  const dom = target.element?.getElementsByClassName('inner')[0] as HTMLElement
  if (dom) {
    const { size, color } = item.font || {}
    if (size != void 0) {
      dom.style.fontSize = typeof size === 'string' ? size : size + 'px'
    }
    if (color != void 0) {
      dom.style.color = color
    }
    dom.textContent = `${item.value || 0}${item.unit}`
  }
}

// 创建 dot 点位
const createDotObject = item => {
  updateDotVisible(
    scene.addDot(item, e => {
      emits('click-dot', toRaw(item), e)
    })
  )
}

// 弹窗展示数据
const dialogShowData = () => {
  const object = dialog.select[0]
  const data = object.data
  dialog.data = data as Partial<ObjectItem>
  dialog.title = data?.name || ''
  dialog.show = true

  const pos = updateDialogPosition(object)
  emits('click-dialog-dot', data as ObjectItem, pos)
}

// 更新 dialog 坐标
const updateDialogPosition = object => {
  const dom = containerRef.value
  const pos = UTILS.getPlanePosition(dom, object, scene.camera)
  dialog.position = pos
  dialog.style.left = pos.left + 'px'
  dialog.style.top = pos.top + 'px'
  return pos
}

// 循环加载对象
const loopLoadObject = async (item: ObjectItem) => {
  if (!item) return
  const { type, url } = item
  const obj = getModel(type)
  if (!obj) {
    // 地址存在 属于 base 底座
    if (!!url) {
      await loadBase(item)
    } else {
      // 点位
      if (type === props.dotKey) {
        createDotObject(item)
      }
    }
    return
  }

  const floorType = props.floorModelType || []
  const anchorType = props.anchorType || []

  // 深克隆
  let model = UTILS.deepClone(obj)
  const { position: POS, scale: SCA, rotation: ROT } = UTILS.get_P_S_R_param(model, item)
  const [x, y, z] = POS

  // 缩放
  model.scale.set(...SCA)

  // 摆放位置
  model.position.set(x, y, z)
  // 转换方位
  model.rotation.set(...ROT)

  // 动画类型
  const animationModelType = props.animationModelType || []
  // 颜色网格
  const colorMeshName = props.colorMeshName || []

  if (animationModelType.includes(type)) {
    if (model.type !== 'Group') {
      const group = new THREE.Group()
      group.add(model)
      group.name = model.name
      model = group
    }
    // 主体网格
    if (props.mainBodyChangeColor) {
      const children = model.children[0]?.children || []
      const mesh = children.filter(it => (props.mainBodyMeshName || []).some(t => it.name.indexOf(t) > -1))
      const cobj = COLORS.normal
      let color = cobj.main || cobj.color
      let colrs = UTILS.getColorArr(color)
      if (colrs.length) {
        mesh.forEach((e, i) => {
          UTILS.setMaterialColor(e, colrs[i % colrs.length])
        })
      }
      model[DEFAULTCONFIG.meshKey.body] = mesh
    }

    // 升起动画
    // model.position.y = y - 30
    // UTILS.deviceAnimate( model, { y } )
    const meshs = UTILS.findObjectsByHasProperty(model.children, colorMeshName)
    // 叶轮动画
    let mixer = new THREE.AnimationMixer(model)
    let action
    if (obj.animations.length) {
      action = mixer.clipAction(obj.animations[0])
      // 暂停
      action.paused = true
      // 动画速度
      action.timeScale = 1.5
      // 播放
      action.play()
    }
    // 记录数据
    model.extra = { action, mixer, meshs }
  } else {
    const meshs: any[] = []
    model.traverse(el => {
      if (typeof el.name == 'string' && colorMeshName.some(t => el.name.indexOf(t) > -1)) {
        meshs.push(el)
      }
    })
    if (meshs.length) {
      // 记录数据
      model[DEFAULTCONFIG.meshKey.color] = meshs
    }
  }

  model._isDevice_ = true
  model.data = item

  // 楼层
  if (floorType.includes(type)) {
    // 原始点位 备用
    model._position_ = { x, y, z }
    model._isFloor_ = true
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true
  }

  scene.addDevice(model)

  return Promise.resolve()
}

// 初始化设备列表
const initDevices = () => {
  let i = 0,
    len = deviceConfigs.value.length
  return new Promise(resolve => {
    if (len == 0) return resolve(null)
    const _loop = async () => {
      const item = deviceConfigs.value[i]
      await loopLoadObject(item)
      i++
      if (i < len) {
        _loop()
      } else {
        resolve(i)
      }
    }
    _loop()
  })
}

// 初始化设备配置
const deviceConfigs = ref<ObjectItem[]>([])
const initDeviceConfigs = () => {
  deviceConfigs.value.length = 0
  const list = toRaw(props.objects) || []

  if (typeof props.formatObject !== 'function') {
    deviceConfigs.value = list
    console.warn(Error('未传入格式化函数 formatObject'))
  } else {
    const data = props.formatObject(list)
    deviceConfigs.value = data
  }
}

// 组装场景
const assemblyScenario = async () => {
  // 加载进度 100
  progress.percentage = 100
  progress.show = false

  // 清除
  scene.clearDevice()

  await nextTick()
  initDeviceConfigs()
  await initDevices()

  // 巡航
  scene.setCruisePoint(props.cruise.points)

  if (typeof props.config?.load === 'function') {
    props.config?.load(scene)
  }

  // 楼层索引存在则执行楼层动画
  const floorIndex = props.config?.floorExpandIndex || -1
  const to = scene.getAnimTargetPos(props.config || {})
  const floors = scene.getFloor()
  if (floorIndex > -1 && floors.length) {
    floorAnimate(floorIndex)
    // 楼层展开是否改变视角
    if (!props.config?.floorExpandChangeViewAngle) {
      // 入场动画
      UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
        emits('loaded')
        scene.controlSave()
      })
    }
  } else {
    // 入场动画
    UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
      emits('loaded')
      scene.controlSave()
    })
  }
}

// 加载
const load = () => {
  loadModels(props.models, () => {
    assemblyScenario()
  })
}

const initPage = () => {
  load()
  if (props.skyCode) {
    backgroundLoad(scene, props.skyCode)
  }
}

// 更新
const updateObject = isRandom => {
  const emitData: ObjectItem[] = []

  if (typeof props.updateObjectCall !== 'function') {
    console.warn(Error('未传入更新回调函数 updateObjectCall'))
  }

  scene.getAll().forEach((el, _i) => {
    if (!el.data) return

    const data = el.data
    // 数据参数
    let type = data.type

    // 点位
    if (type === props.dotKey) {
      updateDotVisible(el)
      return
    }

    if (typeof props.updateObjectCall === 'function') {
      const res = props.updateObjectCall(data, isRandom)
      if (!res) return
      if (typeof res !== 'object') {
        console.warn(Error('更新回调函数返回对象不为 Object，当前类型：' + typeof res))
      }
      Object.keys(res).forEach(key => {
        data[key] = res[key]
      })
    }
    emitData.push(toRaw(data))

    let { status = 0, error = 0, remote = 0, local = 0, disabled = 0 } = data
    // 获取颜色
    const cKey = error > 0 ? 'error' : status > 0 ? 'runing' : 'normal'
    const cobj = COLORS[cKey]
    let color = cobj[type] != void 0 ? cobj[type] : cobj.color

    if (typeof props.getColorCall === 'function') {
      const cr = props.getColorCall(data)
      if (cr) color = cr
    }

    changeModleStatusColor({
      type,
      el,
      colorObj: cobj,
      color,
      paused: status == 0,
      error: error > 0,
      remote: remote > 0,
      local: local > 0,
      disabled: disabled > 0
    })
  })
  emits('update', emitData, isRandom)
}

// 修改模型部件状态及颜色 (类型、模型、颜色对象、颜色、动画暂停状态、故障状态)
const changeModleStatusColor = (opts: import('./index').ChangeMaterialOpts) => {
  let { el, type, colorObj: cobj, color, paused } = opts
  let colors = UTILS.getColorArr(color)
  color = colors[0]

  const meshKey = DEFAULTCONFIG.meshKey

  const colorModelType = props.colorModelType || []
  if (colorModelType.includes(type) && color != void 0) {
    const meshs = el[meshKey.color] || []
    meshs.forEach(e => {
      UTILS.setMaterialColor(e, color)
    })
    return
  }

  // 场景
  // 扩展数据
  const extra = el.extra
  // 状态运行则运动
  if (!!extra) {
    // 暂停状态
    !!extra.action && (extra.action.paused = paused)
    if (color != void 0) {
      const meshs = extra.meshs || []
      meshs.forEach(e => {
        UTILS.setMaterialColor(e, color)
      })
    }
  }

  // 主体变色
  if (props.mainBodyChangeColor && el[meshKey.body]) {
    const color = cobj.main != void 0 ? cobj.main : cobj.color
    let colors = UTILS.getColorArr(color)
    if (colors.length) {
      el[meshKey.body].forEach((e, i) => {
        UTILS.setMaterialColor(e, colors[i % colors.length])
      })
    }
  }
}

onMounted(() => {
  options.container = containerRef.value
  scene = new FloorThreeScene(options, {
    onDblclick: object => {
      const data = object.data
      const index = scene.getFloor().findIndex(el => object.uuid === el.uuid)
      if (typeof data.onDblclick === 'function') {
        data.onDblclick(toRaw(data), object, index)
      } else {
        emits('dblclick', toRaw(data))
      }
      if (index > -1) {
        floorAnimate(index)
      }
    },
    onClickLeft(object) {
      if (object) {
        const data = object.data
        const backData = toRaw(data)
        emits('select', backData)
        // 点位点击事件
        if (typeof data.onClick === 'function') {
          dialog.show = false
          data.onClick(backData)
        } else {
          dialog.select = [object]
          dialogShowData()
        }
      } else {
        dialog.select = []
        dialog.show = false
      }
    },
    onClickRight: _e => {
      dialog.show = false
      if (typeof props.config?.back === 'function') {
        props.config.back(scene)
      } else {
        floorAnimate(-1)
      }
    },
    animateCall: () => {
      // 弹窗位置
      if (dialog.show && !!dialog.select.length) {
        // 设备弹窗信息
        const object = dialog.select[0]
        updateDialogPosition(object)
      }
    }
  })
  scene.run()
  emits('init', scene)
  initPage()
})

defineExpose({
  floorAnimate,
  exportImage: () => scene?.exportImage(),
  update: updateObject
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
