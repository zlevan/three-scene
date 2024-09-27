<template>
  <div :class="$style['map-scene']">
    <div :class="$style.container" ref="containerRef"></div>

    <div :class="$style['dialog-view']" v-if="show" :style="dialog.style">
      <slot name="dialog" :data="dialog.extend" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, withDefaults, toRaw } from 'vue'
import { MapThreeScene } from './methods'

import { numConverter } from '../../utils'

import { useBackground } from '../../hooks/background'
import { useConvertData } from '../../hooks/convert-data'
import { useDialog } from '../../hooks/dialog'

const { backgroundLoad } = useBackground()
const { transformGeoJSON } = useConvertData()
const { show, dialog } = useDialog({
  style: {
    left: '0px',
    top: '0px'
  },
  extend: {}
})

const props = withDefaults(defineProps<import('./index').Props>(), {
  camera: () => ({}),
  cruise: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  grid: () => ({}),
  axes: () => ({}),
  config: () => ({}),
  color: () => ({}),
  corrugatedPlate: true
})

const containerRef = ref()

// 加载完成
const emits = defineEmits<{
  init: [scene: InstanceType<typeof MapThreeScene>]
  click: [e: import('./index').Scatter]
}>()

// 缩放
watch(
  () => props.scale,
  v => {
    scene?.setScale(v || 1)
  }
)

// 地图数据
watch(
  () => props.mapJson,
  json => {
    if (json) {
      scene?.initMap(transformGeoJSON(json))
    }
  }
)

// 轮廓线
watch(
  () => props.outlineJson,
  json => {
    if (json) {
      scene?.initMapOutLine(transformGeoJSON(json))
      if (props.barList) {
        scene?.initMapBar(props.barList || [], barLabelRender)
      }
    }
  }
)

// 飞线
watch(
  () => props.flywire,
  list => {
    scene?.initFlywire(list || [])
  }
)

// 柱状
watch(
  () => props.barList,
  list => {
    scene?.initMapBar(list || [], barLabelRender)
  }
)

// 散点
watch(
  () => props.scatters,
  list => {
    scene?.initScatter(list || [])
  }
)

const barLabelRender = item => {
  if (typeof props.barLabelRender === 'function') return props.barLabelRender(item)
  const { name = '', value = 0, unit = '' } = item
  return {
    name: `
      <div class="label-wrap">
        <div class="name">${name}</div>
        <div class="text">
          <span class="value">${numConverter(value)}</span>
          <span class="unit">${unit}</span>
        </div>
      </div>
    `,
    className: 'map-bar-label'
  }
}

const options: ConstructorParameters<typeof MapThreeScene>[0] = {
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
  axes: props.axes
}

let scene: InstanceType<typeof MapThreeScene>

const initPage = () => {
  if (props.skyCode) {
    backgroundLoad(scene, props.skyCode)
  }
  // 波纹板
  if (props.corrugatedPlate) {
    scene?.addCorrugatedPlate()
  }

  // 飞线
  if (props.flywire && props.flywire.length) {
    scene?.initFlywire(props.flywire)
  }
}

onMounted(() => {
  options.container = containerRef.value
  scene = new MapThreeScene(
    options,
    props.config,
    props.color,
    // 鼠标 hover
    (e, position) => {
      let isShow = !!e
      if (isShow) {
        if (dialog.style) {
          dialog.style.left = position.left + 'px'
          dialog.style.top = position.top + 'px'
        }
        const isScatter = e.isScatter
        const data = e.data
        if (isScatter) {
          data.isScatter = true
          dialog.extend = data
        } else {
          const obj = (props.barList || []).find(it => it.name == e.name)
          if (obj) {
            dialog.extend = obj
          } else {
            isShow = false
          }
        }
      }
      show.value = isShow
    },
    // 点击事件
    data => {
      emits('click', toRaw(data))
    }
  )
  scene.run()

  emits('init', scene)
  initPage()
})

defineExpose({
  exportImage: () => scene?.exportImage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
