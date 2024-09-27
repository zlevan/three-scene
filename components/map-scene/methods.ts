import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import ThreeScene from '../../index'
import { deepMerge, getUrl } from '../../utils'

import { useCSS3D, CSS3DRenderer } from '../../hooks/css3d'
import { useRaycaster } from '../../hooks/raycaster'
import { useCorrugatedPlate } from '../../hooks/corrugated-plate'
import { useCoord } from '../../hooks/coord'
import { useMarkLight } from '../../hooks/mark-light'
import { useCountryLine } from '../../hooks/country-line'
import { useOutline } from '../../hooks/out-line'
import { useFlywire } from '../../hooks/flywire'
import { useMapBar } from '../../hooks/map-bar'

import DEFAULTCONFIG from '../../config'
import CONFIG from './config'
import COLOR from './color'

const { initCSS3DRender, createCSS3DDom } = useCSS3D()
const { raycaster, pointer, style, update: raycasterUpdate } = useRaycaster()
const { createCorrugatedPlate, corrugatedPlateUpdate } = useCorrugatedPlate()
const { getBoundingBox } = useCoord()
const { createMarkLight } = useMarkLight()
const { createCountryFlatLine, getPoints } = useCountryLine()
const { createOutline, outlineUpdate } = useOutline()
const { createFlywireTexture, createFlywire, flywireUpdate } = useFlywire()
const { createBar } = useMapBar()

// 中心点
const centerPos = {
  x: 105.06,
  y: 0,
  z: 32.93
}

//贴图材质加载
const textureLoader = new THREE.TextureLoader()
// 省份贴图
let textureMap: InstanceType<typeof THREE.TextureLoader>
// 法线
let normalTextureMap: InstanceType<typeof THREE.TextureLoader>
// 边贴图
let sideTextureMap: InstanceType<typeof THREE.TextureLoader>
// 背景外圈
let outCircleTexture: InstanceType<typeof THREE.TextureLoader>
// 背景内圈
let innerRingTexture: InstanceType<typeof THREE.TextureLoader>

const textureMapImg = new URL('../../imgs/texttures/gz-map.jpg', import.meta.url).href
const normalTextureMapImg = new URL('../../imgs/texttures/gz-map-fx.jpg', import.meta.url).href
const sideTextureMapImg = new URL('../../imgs/texttures/border.png', import.meta.url).href
const outCircleImg = new URL('../../imgs/texttures/out-circle.png', import.meta.url).href
const innerCircleImg = new URL('../../imgs/texttures/inner-circle.png', import.meta.url).href

// 转换地址
const transformUrl = (defaultUrl, url, baseUrl) => {
  if (url) return getUrl(url, baseUrl)
  return defaultUrl
}

// 创建地图材质
const createMaptexture = (config, baseUrl) => {
  textureMap = textureLoader.load(transformUrl(textureMapImg, config.map.map, baseUrl))
  normalTextureMap = textureLoader.load(transformUrl(normalTextureMapImg, config.map.normal, baseUrl))
  sideTextureMap = textureLoader.load(transformUrl(sideTextureMapImg, config.map.side, baseUrl))
  // 材质属性设置
  textureMap.wrapS = normalTextureMap.wrapS = sideTextureMap.wrapS = THREE.RepeatWrapping
  textureMap.wrapT = normalTextureMap.wrapT = sideTextureMap.wrapT = THREE.RepeatWrapping
  textureMap.flipY = false
  // degToRad 将度数转换为弧度
  // textureMap.rotation = THREE.MathUtils.degToRad(45)
  const scale = 0.0128
  textureMap.repeat.set(scale, scale)
  normalTextureMap.repeat.set(scale, scale)

  outCircleTexture = textureLoader.load(transformUrl(outCircleImg, config.map.bgOutCircle, baseUrl))
  innerRingTexture = textureLoader.load(transformUrl(innerCircleImg, config.map.bgInnerCircle, baseUrl))
}

// 创建地图块
const createMapBlock = (_this, points) => {
  // 绘制二维平面
  const shape = new THREE.Shape(points)
  const opts = {
    // 挤出深度
    depth: _this.config.depth,
    // 对挤出的形状应用是否斜角
    bevelEnabled: true,
    // 斜角的分段层数
    bevelSegments: 1,
    // 设置原始形状上斜角的厚度
    bevelThickness: 0,
    // 挤出样条的深度细分的点的数量
    steps: 0,
    // 斜角与原始形状轮廓之间的延伸距离
    bevelSize: 0
  }

  // 挤压几何体
  const geometry = new THREE.ExtrudeGeometry(shape, opts)

  // 表面材质
  const material = new THREE.MeshPhongMaterial({
    color: _this.color.main,
    map: textureMap,
    normalMap: normalTextureMap,
    // 颜色与贴图结合方式
    // MeshLambertMaterial 和 MeshPhongMaterial 当中。
    // MultiplyOperation 是默认值，它将环境贴图和物体表面颜色进行相乘。
    // MixOperation 使用反射率来混和两种颜色。uses reflectivity to blend between the two colors.
    // AddOperation 用于对两种颜色进行相加。
    combine: THREE.MultiplyOperation,
    transparent: true,
    opacity: 0.8
  })
  // 边框材质
  const sideMaterial = new THREE.MeshLambertMaterial({
    color: COLOR.borderColor,
    map: sideTextureMap,
    transparent: true,
    opacity: 0.9
  })
  const mesh = new THREE.Mesh(geometry, [material, sideMaterial])
  mesh.scale.setScalar(_this.config.scale)
  mesh.name = '地图拼块'
  return mesh
}

// 省份名称背景
const labelImg = new URL('../../imgs/label.png', import.meta.url).href

// 创建 css3d 省份名称
const createCSS3Dlabel = (_this, properties, group) => {
  // 判断省份数据中心点
  if (!properties.centroid && !properties.center) {
    return false
  }
  const { depth, scale } = _this.config
  const [lon, lat] = properties.centroid || properties.center
  const label = createCSS3DDom({
    name: `
      <img src="${labelImg}" />
      <div class="name">${properties.name}</div>
    `,
    className: 'map-3D-label',
    position: [lon * scale, lat * scale * 0.995, depth * scale]
    // onClick: e => {console.log(e)}
  })
  label.rotateX(Math.PI * 0.5)
  label.name = properties.name + '_CSS3D_label'
  label.isLabel = true
  group.add(label)
}

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// 创建省份光柱
const createMarkLightPoint = (_this, properties, group) => {
  if (!properties.centroid && !properties.center) {
    return false
  }
  const { depth, scale } = _this.config
  // 创建光柱
  const height = 1 + random(5, 10) / 4
  const [lon, lat] = properties.centroid || properties.center
  const light = createMarkLight(
    [lon, lat, depth * 1.01].map(t => t * scale),
    height * scale,
    {
      factor: scale,
      color: _this.color.markColor1
    }
  )
  light.rotateX(-Math.PI / 2)
  group.add(light)
}

// 创建上下边框
const createBorderLine = (_this, mapJson) => {
  let lineTop = createCountryFlatLine(
    mapJson,
    {
      color: COLOR.line,
      transparent: true
    },
    'Line2'
  )
  const { depth, scale } = _this.config
  lineTop.name = '地图上边框'
  lineTop.position.y += depth * scale
  let lineBottom = createCountryFlatLine(
    mapJson,
    {
      color: COLOR.line2
    },
    'Line2'
  )
  lineBottom.name = '地图下边框'
  lineTop.scale.setScalar(scale)
  lineBottom.scale.setScalar(scale)
  _this.scene.add(lineTop)
  _this.scene.add(lineBottom)
}

// 外圈背景
const createOutRing = (scene, width) => {
  let plane = new THREE.PlaneGeometry(width, width)
  let material = new THREE.MeshBasicMaterial({
    map: outCircleTexture,
    transparent: true,
    opacity: 0.6,
    depthTest: true
  })
  let mesh = new THREE.Mesh(plane, material)
  const { x, z } = centerPos
  mesh.position.set(x, -1, z)
  mesh.scale.setScalar(1.2)
  mesh.rotateX(-Math.PI * 0.5)
  scene.add(mesh)
  return mesh
}

// 内圈背景
const createInnerRing = (scene, width) => {
  let plane = new THREE.PlaneGeometry(width, width)
  let material = new THREE.MeshBasicMaterial({
    map: innerRingTexture,
    transparent: true,
    opacity: 0.3,
    depthTest: true
  })
  let mesh = new THREE.Mesh(plane, material)
  const { x, z } = centerPos
  mesh.position.set(x, -2, z)
  mesh.scale.setScalar(1.2)
  mesh.rotateX(-Math.PI * 0.5)
  scene.add(mesh)
  return mesh
}

// 创建散点
const createScatter = (_this, longitude: number, latitude: number) => {
  const { scale, depth } = _this.config
  const group = new THREE.Group()
  const size = 0.2 * scale
  // 圆盘
  const circle = new THREE.CircleGeometry(size, 32)
  const circleMat = new THREE.MeshBasicMaterial({ color: COLOR.scatterColor1, transparent: true, opacity: 1 })
  const circleMesh = new THREE.Mesh(circle, circleMat)

  // 半球
  const sphere = new THREE.SphereGeometry(size * 0.8, 32, 32, 0, Math.PI)
  const sphereMat = new THREE.MeshBasicMaterial({ color: COLOR.scatterColor2, transparent: true, opacity: 1 })
  const sphereMesh = new THREE.Mesh(sphere, sphereMat)
  group.add(circleMesh, sphereMesh)
  group.position.set(longitude * scale, latitude * scale, depth * scale * 1.005)
  return group
}

export class MapThreeScene extends ThreeScene {
  // 配置
  config: import('./index').Config
  // 颜色
  color: import('./index').Color
  // 波纹板
  corrugatedPlate?: InstanceType<typeof THREE.Mesh>
  // 时间
  clock: InstanceType<typeof THREE.Clock>
  // 地图组
  mapGroup?: InstanceType<typeof THREE.Group>
  // 散点组
  scatterGroup?: InstanceType<typeof THREE.Group>
  // 飞线组
  flywireGroup?: InstanceType<typeof THREE.Group>
  // CSS3D 渲染器
  css3DRender: InstanceType<typeof CSS3DRenderer>
  // 地图轮廓
  outline?: ReturnType<typeof createOutline>
  // hover 回调
  #hoverBack?: (e, position: typeof style) => void
  #clickBack?: (e) => void
  // 外圈背景
  outRingMesh?: InstanceType<typeof THREE.Mesh>
  // 内圈背景
  innerRingMesh?: InstanceType<typeof THREE.Mesh>

  constructor(
    options: ConstructorParameters<typeof ThreeScene>[0],
    config: Partial<import('./index').Config> = {},
    color: Partial<import('./index').Color> = {},
    hoverBack?: (e, position: typeof style) => void,
    clickBack?: (e) => void
  ) {
    super(options)
    this.config = deepMerge(CONFIG, config)
    this.color = deepMerge(COLOR, color)
    this.#hoverBack = hoverBack
    this.#clickBack = clickBack

    this.clock = new THREE.Clock()
    this.css3DRender = initCSS3DRender(this.options, this.container)

    createMaptexture(this.config, this.options.baseUrl)
    this.bindEvent()
  }

  // 添加波纹板
  addCorrugatedPlate() {
    if (this.corrugatedPlate) {
      this.disposeObj(this.corrugatedPlate)
      this.corrugatedPlate = void 0
    }
    // 波纹板
    const cpMh = createCorrugatedPlate({
      range: this.config.plateRadius,
      factor: this.config.scale,
      color: this.color.plateColor,
      light: this.color.plateLight
    })
    cpMh.renderOrder = 0
    this.corrugatedPlate = cpMh
    this.addObject(cpMh)
  }

  // 初始化地图
  initMap(geoJson) {
    // 存在则销毁
    if (this.mapGroup) {
      this.disposeObj(this.mapGroup)
      this.mapGroup = null
    }
    const mapGroup = new THREE.Group()
    mapGroup.name = '地图'

    const data = geoJson.features,
      len = data.length
    for (let i = 0; i < len; i++) {
      const item = data[i]
      // 定一个省份对象
      const provinceObj = new THREE.Object3D()
      // 坐标
      const coordinates = item.geometry.coordinates
      // city 属性
      const properties = item.properties
      for (let j = 0; j < coordinates.length; j++) {
        coordinates[j].forEach(polygon => {
          // 点位集合
          const points = polygon.map(el => new THREE.Vector2(el[0], el[1]))
          // 创建地图区块
          const mesh = createMapBlock(this, points)
          // 省份区块标记
          mesh.isProvinceBlock = true
          provinceObj.add(mesh)
        })
      }

      if (this.config.areaLabel) {
        // 创建 label
        createCSS3Dlabel(this, properties, provinceObj)
      }
      if (this.config.markLight) {
        // 创建光柱
        createMarkLightPoint(this, properties, provinceObj)
      }

      // 翻转角度
      provinceObj.rotateX(-Math.PI / 2)
      // 省份组合标记
      provinceObj.isProvinceGroup = true
      provinceObj.name = properties.name
      provinceObj.data = properties
      mapGroup.add(provinceObj)
    }

    this.mapGroup = mapGroup
    this.addObject(mapGroup)

    if (this.config.border) {
      // 创建上下边线
      createBorderLine(this, geoJson)
    }

    // 计算包围盒
    const box = getBoundingBox(mapGroup)

    let {
      size,
      center: { x, y, z }
    } = box
    centerPos.x = x
    centerPos.y = y
    centerPos.z = z
    this.corrugatedPlate.position.set(x, 0 - 0.1 * this.config.scale, z)

    // 重置场景元素
    this.resetSceneEle()
    if (this.config.mapBg) {
      // 宽度
      const width = size.x < size.y ? size.y + 1 : size.x + 1

      // 添加背景，修饰元素
      this.outRingMesh = createOutRing(this.scene, width * this.config.bgOutFactor)
      this.innerRingMesh = createInnerRing(this.scene, width * this.config.bgInnerFactor)
    }
  }

  // 轮廓
  initMapOutLine(geoJson) {
    // 存在则销毁
    if (this.outline) {
      this.disposeObj(this.outline)
      this.outline = null
    }
    const points = getPoints(geoJson, this.config.depth, !true)
    const outline = createOutline(points, {
      factor: this.config.scale,
      color: this.color.outline
    })
    outline.renderOrder = 10
    this.outline = outline
    this.addObject(outline)
  }

  // 飞线
  initFlywire(points: import('./index').Flywire[]) {
    const name = '飞线集合'
    // 存在则销毁
    if (this.flywireGroup) {
      this.disposeObj(this.flywireGroup)
      this.flywireGroup = null
    }

    const { scale, depth } = this.config
    const COLOR = this.color
    createFlywireTexture({
      depth: depth,
      color: COLOR.line,
      flyColor: COLOR.flyColor2,
      pointColor: COLOR.flyColor1,
      factor: scale
    })
    const flywireGroup = new THREE.Group()
    for (let i = 0; i < points.length; i++) {
      const { coords, path } = points[i]
      const mesh = createFlywire(
        coords.map(it => {
          return it.map(t => t * scale)
        })
      )
      mesh.name = path
      flywireGroup.add(mesh)
    }
    flywireGroup.name = name
    flywireGroup.renderOrder = 20
    this.flywireGroup = flywireGroup
    this.addObject(flywireGroup)
  }

  // 柱状
  initMapBar(citys, labelRender) {
    if (!this.config.mapBar) return
    // 清除柱状
    if (!this.mapGroup) return
    this.clearMapBar()

    // 找对大
    const max = Math.max(...citys.map(it => it.value || 0))
    const { scale, depth } = this.config
    const COLOR = this.color
    const options = {
      height: 5,
      size: 0.2,
      factor: scale,
      color1: COLOR.markColor1,
      color2: COLOR.markColor2
    }
    for (let i = 0; i < citys.length; i++) {
      const { name = '', value = 0 } = citys[i]
      const el = this.mapGroup.getObjectByName(name)
      if (!el) {
        console.log(name, el)
      } else {
        const heightRatio = value / max || 0
        const { centroid, center } = el.data
        const pos = centroid || center
        const bar = createBar(
          {
            position: [pos[0] * scale, pos[1] * scale, depth * scale],
            heightRatio,
            label: labelRender(citys[i])
          },
          options
        )
        bar.isBar = true
        el.add(bar)
      }
    }
  }

  // 清除柱状图
  clearMapBar() {
    this.mapGroup.traverse(el => {
      if (el.isBar) {
        this.disposeObj(el)
      }
    })
  }

  // 散点
  initScatter(points: import('./index').Scatter[]) {
    const name = '散点集合'
    // 存在则销毁
    if (this.scatterGroup) {
      this.disposeObj(this.scatterGroup)
      this.scatterGroup = null
    }
    const scatterGroup = new THREE.Group()
    scatterGroup.name = name

    for (let i = 0; i < points.length; i++) {
      const item = points[i]
      const [longitude = 0, latitude = 0] = item.coord || []
      const mesh = createScatter(this, longitude, latitude)
      mesh.name = item.name
      mesh.data = item
      mesh.isScatter = true
      scatterGroup.add(mesh)
    }
    scatterGroup.rotateX(-Math.PI * 0.5)
    this.scatterGroup = scatterGroup
    this.addObject(scatterGroup)
  }

  // 双击
  onDblclick(e: MouseEvent) {
    console.log(e)
  }

  // 按下
  onPointerDown(e: PointerEvent) {
    this.pointer.isClick = true
    this.pointer.tsp = e.timeStamp
  }

  // 鼠标移动
  onPointerMove(e) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)

    if (this.mapGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.mapGroup]
      if (this.scatterGroup) objects.push(this.scatterGroup)
      const interscts = raycaster.intersectObjects(objects)
      this.container.style.cursor = interscts.length ? 'pointer' : 'auto'
      if (interscts.length > 0) {
        const object = interscts[0].object
        let puuid
        const pObj = this.findParentGroupGroupUuid(object)
        if (pObj) {
          puuid = pObj.uuid
          this.#hoverProvince(pObj)
        }
        this.setMapBlockColor(puuid)
      } else {
        this.#hoverProvince()
        this.setMapBlockColor()
      }
    }
  }

  // 弹起
  onPointerUp(e: PointerEvent): void {
    this.pointer.isClick = false
    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < (this.config.rightClickBackDiffTime || DEFAULTCONFIG.rightClickBackDiffTime)
    if (e.button == 2) {
      // console.log('你点了右键')
    } else if (e.button == 0) {
      // console.log('你点了左键', isClick)
      isClick && this.clickObject(e)
    } else if (e.button == 1) {
      // console.log('你点了滚轮')
    }
  }

  // 查找父级组合
  findParentGroupGroupUuid(object) {
    const _find = obj => {
      let parent = obj.parent
      if (!parent) {
        return
      }
      if ((parent && parent.isProvinceGroup) || parent.isScatter) {
        return parent
      }
      return _find(parent)
    }
    return _find(object)
  }

  // 地图省份 hover
  #hoverProvince(pObj?) {
    if (typeof this.#hoverBack === 'function') this.#hoverBack(pObj, style)
  }

  // 设置地图面颜色
  setMapBlockColor(puuid?) {
    this.mapGroup.traverse(el => {
      if (el.isProvinceBlock) {
        el.material[0].color.set(el.parent.uuid === puuid ? this.color.mainHover : this.color.main)
        el.material[1].color.set(el.parent.uuid === puuid ? this.color.borderHoverColor : this.color.borderColor)
      } else if (el.isLabel) {
        const isTarget = el.parent.uuid === puuid
        el.element.className = `map-3D-label${isTarget ? ' is-active' : ''}`
      }
    })
  }
  // 点击元素
  clickObject(e) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)

    if (this.scatterGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.scatterGroup]
      const interscts = raycaster.intersectObjects(objects)
      this.container.style.cursor = interscts.length ? 'pointer' : 'auto'
      if (interscts.length) {
        const obj = interscts[0].object
        const pObj = this.findParentGroupGroupUuid(obj)
        const data = pObj.data || {}
        if (typeof this.#clickBack === 'function') this.#clickBack(data)
      }
    }
  }

  // 重置场景元素
  resetSceneEle() {
    const { x, y, z } = centerPos
    // 设置相机对焦位置
    this.camera.lookAt(x, y, z)
    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: x,
          y: 90 * this.config.scale,
          z: z + 40 * this.config.scale
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {})

    // 控制器
    this.controls.target = new THREE.Vector3(x, y, z - 5 * this.config.scale)

    // 网格
    if (this.grid) {
      this.grid.position.set(x, 0, z)
      const group = this.scene.getObjectByName(this.forkName)
      group.position.set(x, 0, z)
    }
  }

  modelAnimate() {
    let dalte = this.clock.getDelta()
    // 波纹板
    if (this.corrugatedPlate) {
      corrugatedPlateUpdate(this.corrugatedPlate, dalte)
    }

    // css 3D 渲染器
    if (this.css3DRender) {
      this.css3DRender.render(this.scene, this.camera)
    }

    // 地图边贴图
    if (sideTextureMap) {
      sideTextureMap.offset.y += 0.005
    }

    // 旋转背景外圈
    if (this.outRingMesh) {
      this.outRingMesh.rotation.z += 0.0005
    }

    // 旋转背景内圈
    if (this.innerRingMesh) {
      this.innerRingMesh.rotation.z -= 0.0005
    }

    // 轮廓
    if (this.outline) {
      outlineUpdate(this.outline)
    }

    // 飞线
    if (this.flywireGroup) {
      flywireUpdate()
    }
  }
  resize() {
    super.resize()
    if (this.css3DRender) {
      const { width, height } = this.options
      this.css3DRender.setSize(width, height)
    }
  }
}
