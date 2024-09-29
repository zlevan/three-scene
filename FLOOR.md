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
| models | Array | - | - | [场景加载类型对应的模型](./FLOOR.md#Models) |
| config | Object | - | - | [配置](./FLOOR.md#Config) |
| objects | Array | - | - | [对象列表](./FLOOR.md#Objects) |

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


### Models
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| key | String | - | - | 模型 唯一 key（场景元素按照 对应 key 加载） |
| name | String | - | - | 模型名称 |
| size | Number | - | - | 模型文件大小 （M 为单位） |
| url | String | - | - | 模型加载地址 |
| type | String | [Modeltype](./FLOOR.md#Modeltype) | - | 模型类型 |
| mapUrl | String | - | - | 贴图 |
| mapMeshName | String | - | - | 需要贴图的网格名称 |
| repeat | Array | - | - | 精灵贴图 |
| range | Object | - | - | 精灵大小,{x: 1, y; 1 } |

### Modeltype 
| 类型 | 说明 |
|-----|-----|
| base | 基础底座 |
| device | 场景设备 |
| font | 字体 |
| sprite | 精灵 |
| pipe | 管路贴图 |
| warning | 警告标识 |
| remote | 远程状态 | 
| local | 本地标识 | 
| disabled | 禁用标识 |

### Config
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|
| to | Object | - | - | [场景相机位置](./README.md#XYZ) |
| target | object | - | - | [场景中心点/相机聚焦位置](./README.md#XYZ) |
| floorExpandMode | String | [ExpandMode](./FLOOR.md#ExpandMode) | 'UD' | 楼层展开模式 |
| floorExpandMargin | Number | - | 200 | 楼层展开间距 |
| floorExpandHiddenOther | Boolean | - | - | 楼层展开后隐藏其他模型 |
| floorExpandIndex | Number | - | -1 | 楼层展开的索引(楼层类型列表索引) |
| floorExpandChangeViewAngle | Boolean | - | - | 楼层展开是否改变视角 |
| back | Function | - | - | 返回回调函数（右键）|
| load | Function | - | - | 加载完成回调函数 |


### ExpandMode 
| 类型 | 说明 |
|-----|-----|
| UD | up-down |
| BA | before-after |

### Objects
| 属性名 | 类型 | 可选值 | 默认值 | 说明 |
|-----|-----|-----|-----|-----|