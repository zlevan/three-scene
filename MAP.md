# 地图组件（map-scene）

### Props
| 参数 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| devEnv | Boolean | - | - | 是否开发环境 |
| baseUrl | String | - | '' | 基础地址（加载资源地址）|
| dracoUrl | String | - | - | draco 解码器文件地址（模型解码）|
| bgColor | String/Number | - | - | 背景色 |
| skyCode | String | 216,217,218,219,220,221,222,223,224,225 | - | 天空 code（预存的天空图片组）|
| bgUrl | String/Array | - | - | 背景图（数组时为 6 个一组，可生成空间图）|
| env | String | - | - | hdr 环境文件地址 |
| scale | Number | - | - | 缩放（容器缩放大小）|
| camera | Object | - | - | [相机](./README.md#Camera) |
| cruise | Object | - | - | [巡航](./README.md#Cruise) |
| fog | Object | - | - | [雾化](./README.md#Fog) |
| render | Object | - | - | [渲染器](./README.md#Render) |
| controls | Object | - | - | [控制器](./README.md#Controls) |
| grid | Object | - | - | [网格](./README.md#Grid) |
| axes | Object | - | - | [坐标](./README.md#Axes) |
| directionalLight | Object | - | - | [平行光](./README.md#DirectionalLight) |
| color | Object | - | - | [地图配色](./MAP.md#Color) |
| config | Object | - | - | [地图配置](./FLOOR.md#Config) |
| corrugatedPlate | Boolean | - | true | 波纹板 |
| mapJson | GeoJson | - | - | [地图配置（省份）](https://datav.aliyun.com/portal/school/atlas/area_selector)-地图 geo 数据 |
| outlineJson | GeoJson | - | - | 轮廓配置-地图 geo 数据 |






### Color
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| main | Number/String | - | 0x338ad7 | 主色（地图面） |
| mainHover | Number/String | - | 0x92ffff | 主色 hover 色 |
| light | Number/String | - | 0x92ffff | 浅色 |
| lightHover | Number/String | - | 0x92ffff | 浅色 hover 色 |
| borderColor | Number/String | - | 0x92ffff | 边(区域侧边) |
| borderHoverColor | Number/String | - | 0x10467a | 边 hover 色 |
| plateColor | Number/String | - | 0x338ad7 | 波纹板 |
| plateLight | Number/String | - | 0x10467a | 波纹板浅色 |
| line | Number/String | - | 0x91dbf3 | 线条(地图区块上线条) |
| line2 | Number/String | - | 0x61fbfd | 线条(地图区块下线条) |
| outline | Number/String | - | 0xb4eafc | 轮廓线 |
| markColor1 | Number/String | - | 0xcaffff | mark 颜色(光柱)1 |
| markColor2 | Number/String | - | 0x69f8ff | mark 颜色(光柱)2 |
| flyColor1 | Number/String | - | 0x91dbf3 | 飞线1 |
| flyColor2 | Number/String | - | 0x61fbfd | 飞线2 |
| scatterColor1 | Number/String | - | 0x91dbf3 | 散点1 |
| scatterColor2 | Number/String | 0x61fbfd | - | 散点2 |



### Config
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| depth | Number | - | 1 | 地图深度 |
| scale | Number | - | 40 | 地图缩放倍数 |
| plateRadius | Number | - | 200 | 波纹板半径 |
| rightClickBackDiffTime | Number | - | 100 | 右键间隔时间 |
| areaLabel | Boolean | - | false | 区域 label |
| markLight | Boolean | - | false | 光柱 |
| border | Boolean | - | true | 上下边框 |
| mapBg | Boolean | - | true | 地图背景 |
| mapBar | Boolean | - | true | 地图柱状图 |
| bgOutFactor | Number | - | true | 外背景因素（缩放大小） |
| bgInnerFactor | Number | - | 0.9 | 内背景因素（缩放大小） |
| map | Object | - | - | [地图贴图](./MAP.md#Map) |

### Map
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| map | String | - | - | 贴图 |
| normal | String | - | - | 法线贴图 |
| side | String | - | - | 区域边贴图 |
| bgOutCircle | String | - | - | 背景外圈 |
| bgInnerCircle | String | - | - | 背景内圈 |

