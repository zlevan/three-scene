# three-scene
基于 three 封装的场景功能

## 基本类

```vue
<template>
  <div class="container" ref="containerRef"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ThreeScene } from 'three-scene'

const containerRef = ref()

const options: ConstructorParameters<typeof ThreeScene>[0] = {
  camera: {
    position: [0, 3, 5]
  },
  grid: {
    visible: true
  },
  axes: {
    visible: true
  }
}

let scene: InstanceType<typeof ThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new ThreeScene(options)
  scene.run()
})
</script>
<style lang="scss" module>
.container {
  height: 100%;
  position: relative;
}
</style>
```

## API

### Options
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| container  | HTMLElement/String | - | - | 容器 |
| baseUrl | String | - | '' | 加载资源基本地址 |
| bgColor | Number/String | - | - | 背景色,0x000000,'#000000' |
| bgUrl | String/String[] | - | - | 背景图数组（6 张图）时可组成环境图 |
| env | String | - | - | 场景环境，影响场景所有元素，仅支持 hdr 文件 |
| scale | Number | - | 1 | 缩放倍数，具体表现在计算坐标位置 |
| fog | Object | - | - | 雾化，[具体详情](README.md#fog) |

### fog
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| near | Number | - | 100 | 雾化最近距离 |
| far | Number | - | 1000 | 雾化最远距离
