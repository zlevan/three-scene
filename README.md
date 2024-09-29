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

### Attributes
| 属性名 | 类型 | 说明 |
|-----|------|------|
| options | Object | [配置](./README.md#options) |
| container | HTMLElement | 容器 |
| scene | InstanceType &lt;typeof THREE.Scene&gt; | 场景对象 |
| renderer | InstanceType &lt;typeof THREE.WebGLRenderer&gt; | 渲染器对象 |
| baseCamera | InstanceType &lt;typeof THREE.PerspectiveCamera&gt; | 基础相机对象 |
| cruiseCamera | InstanceType &lt;typeof THREE.PerspectiveCamera&gt; | 巡航相机对象 |
| cruiseGroup | InstanceType &lt;typeof THREE.group&gt; | 巡航组 |
| controls | InstanceType &lt;typeof OrbitControls&gt; | 控制器对象 |
| grid | InstanceType &lt;typeof THREE.GridHelper&gt; | 网格对象 |
| animationId | number | requestAnimationFrame 方法执行 id |
| forkName | Symbol | 网格交叉分组名称 |

### Options
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| container  | HTMLElement/String | - | - | 容器 |
| baseUrl | String | - | '' | 加载资源基本地址 |
| bgColor | Number/String | - | - | 背景色,0x000000,'#000000' |
| bgUrl | String/String[] | - | - | 背景图数组（6 张图）时可组成环境图 |
| env | String | - | - | 场景环境，影响场景所有元素，仅支持 hdr 文件 |
| scale | Number | - | 1 | 缩放倍数，具体表现在计算坐标位置 |
| fog | Object | - | - | [雾化](./README.md#Fog) |
| render | Object | - | - | [渲染器](./README.md#Render) |
| controls | Object | - | - | [控制器](./README.md#Controls) |
| ambientLight | Object | - | - | [环境光](./README.md#AmbientLight) |
| directionalLight | Object | - | - | [平行光](./README.md#DirectionalLight) |
| camera | Object | - | - | [相机](./README.md#Camera) |
| grid | Object | - | - | [网格](./README.md#Grid) |
| axes | Object | - | - | [坐标](./README.md#Axes) |
| cruise | Object | - | - | [巡航](./README.md#Cruise) |

### Fog
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| near | Number | - | 100 | 雾化最近距离 |
| far | Number | - | 1000 | 雾化最远距离

### Render
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| antialias | Boolean | - | true | 是否开启反锯齿 |
| alpha | Boolean | - | false | 画布透明度缓冲区 |
| logarithmicDepthBuffer | Boolean | - | true | 设置对数深度缓存 |
| preserveDrawingBuffer | Boolean | - | false | 是否保留缓冲区直到手动清除或覆盖，需要截图设置为 true，性能会下降 |

### Controls
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| enableDamping | Boolean | - | false | 阻尼（惯性）|
| dampingFactor | Number | - | 0.25 | 阻尼系数，鼠标灵敏度 |
| autoRotate | Boolean | - | false | 自动旋转 |
| maxPolarAngle | Number | - | - | 相机垂直旋转角度上限 | 
| enableZoom | Boolean | - | true | 缩放 |
| enablePan | Boolean | - | true | 右键拖拽 |
| screenSpacePanning | Boolean | - | true | 相机垂直平移 |
| minDistance | Number | - | 1 | 相机距离原点最近距离 |
| maxDistance | Number | - | 2000 | 相机距离原点最远距离 |

### AmbientLight
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| color | Number/String | - | 0xffffff | 环境光颜色 |
| intensity | Number | - | 1.5 | 光强度 |

### DirectionalLight
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| helper | Boolean | - | false | 辅助器 |
| light2 | boolean | - | true | 第二个平行光开启 |
| color | Number/String | - | 0xffffff | 平行光颜色 |
| intensity | Number | - | 1.5 | 光强度 |

### Camera
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| helper | Boolean | - | false | 辅助器 |
| near | Number | - | 1 | 相机最近距离 |
| far | Number | - | 10000 | 相机最远距离 |
| position | Array | - | [-350, 510, 700] | 相机位置坐标 |

### Grid
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| transparent | Boolean | - | true | 透明 |
| opacity | Number | - | 0.3 | 透明度 |
| width | Number | - | 800 | 网格宽度 |
| divisions | Number | - | 80 | 网格等分数 |
| centerLineColor | Number/String | - | 0xa1a1a1 | 中心线颜色 |
| gridColor | Number/String | - | 0xa1a1a1 | 网格颜色 |
| fork | Boolean | - | false | 网格交叉点 |
| forkSize | Number | - | 1.4 | 网格交叉点大小 |
| forkColor | Number/String | - | 0xa1a1a1 | 网格交叉点颜色 |

### Axes
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| size | Number | - | 50 | 坐标轴大小 |

### Cruise
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|------|------|------|------|
| visible | Boolean | - | false | 可见 |
| helper | Boolean | - | false | 辅助器 |
| points | Array | - | [] | 巡航点位 |
| segment | Number | - | 2 | 巡航分段数 |
| tension | Number | - | 0 | 巡航曲线张力 |
| mapUrl | String | - | - | 贴图地址 |
| repeat | Array | - | [0.1, 1] | 贴图重复 |
| width | Number | - | 15 | 宽度 |
| speed | Number | - | 1 | 巡航时速度 |
| mapSpeed | Number | - | 0.006 | 贴图材质动画滚动速度 |
| offset | Number | - | 10 | 巡航点偏差（距离巡航点的上下偏差）|



### Methods
| 方法名 |  参数 | 说明 |
|-----|------|------|
| init | - | 初始化（灯光、网格、坐标轴、模型）|
| run | - | 运行（循环渲染、控制器可视操作） |