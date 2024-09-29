# 楼层组件（floor-scene）

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
| colors | Object | - | - | [模型不同状态对应不同颜色](./FLOOR.md#Colors) |
| indexDB | Object | - | - | [indexdb 数据库配置](./FLOOR.md#IndexDB) |
| camera | Object | - | - | [相机](./README.md#Camera) |
| cruise | Object | - | - | [巡航](./README.md#Cruise) |
| fog | Object | - | - | [雾化](./README.md#Fog) |
| render | Object | - | - | [渲染器](./README.md#Render) |
| controls | Object | - | - | [控制器](./README.md#Controls) |
| grid | Object | - | - | [网格](./README.md#Grid) |
| axes | Object | - | - | [坐标](./README.md#Axes) |
| directionalLight | Object | - | - | [平行光](./README.md#DirectionalLight) |

### Colors
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| normal | Object | - | - | [正常状态颜色](./FLOOR.md#ColorObject) |
| runing | Object | - | - | [运行状态颜色](./FLOOR.md#ColorObject) |
| error | Object | - | - | [故障状态颜色](./FLOOR.md#ColorObject) |

### ColorObject
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| color | Number/String/Array | - | - | 默认颜色 |
| main | Number/String/Array | - | - | 主题颜色 |
| text | Number/String/Array | - | - | 文字颜色 |
| [ key ] | Number/String/Array | - | - | 其他 |


### IndexDB
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| cache | Boolean | - | - | 开启缓存 |
| dbName | String | - | - | 数据库名称 |
| tbName | String | - | - | 表名称 |
| version | Number | - | - | 版本号 |