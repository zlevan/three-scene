import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { deepMerge, isDOM, getUrl } from './utils'
import defOptions from './options'

import { useCruise } from './hooks/cruise'

const { createCruise, cruiseAnimate, updateCruise } = useCruise()
export default class ThreeScene {
  // 配置
  options: import('./types').Options
  // 容器
  container: HTMLElement
  // 场景
  scene: InstanceType<typeof THREE.Scene>
  // 渲染器
  renderer: InstanceType<typeof THREE.WebGLRenderer>
  // 基础相机
  baseCamera: InstanceType<typeof THREE.PerspectiveCamera>
  // 巡航相机
  cruiseCamera?: InstanceType<typeof THREE.PerspectiveCamera>
  // 巡航组
  cruiseGroup?: InstanceType<typeof THREE.group>
  // 控制器
  controls: InstanceType<typeof OrbitControls>
  // 网格
  grid?: InstanceType<typeof THREE.GridHelper>
  // 动画 id
  animationId?: number
  // 静态属性
  static total: number = 0
  // 鼠标
  pointer: {
    tsp: number
    isClick: boolean
  }

  constructor(options: import('./types').Params = {}) {
    // 默认配置
    const defaultOpts = defOptions
    // 配置
    this.options = deepMerge(defaultOpts, options)
    ThreeScene.total++

    this.pointer = {
      tsp: 0,
      isClick: false
    }

    // 容器
    if (isDOM(this.options.container)) {
      this.container = this.options.container as HTMLElement
    } else {
      this.container = document.querySelector(this.options.container as string) as HTMLElement
    }

    this.options.width = this.container.offsetWidth
    this.options.height = this.container.offsetHeight
    this.scene = new THREE.Scene()

    this.renderer = this.initRenderer()
    this.init()
    this.baseCamera = this.initCamera()
    this.controls = this.initControls()
    this.initCruise()
    console.log(this)
  }

  get camera() {
    const { visible, runing } = this.options.cruise
    return visible && runing ? this.cruiseCamera : this.baseCamera
  }

  init() {
    this.initLight()
    this.initGrid()
    this.initAxes()
    this.initModel()
  }

  // 运行
  run() {
    this.loop()
  }

  // 循环
  loop() {
    this.animationId = window.requestAnimationFrame(() => {
      this.loop()
    })
    this.animate()
    this.modelAnimate()
  }

  animate() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
    // 控制相机旋转缩放的更新
    if (this.options.controls.visible) this.controls.update()

    cruiseAnimate(this.cruiseCamera)

    TWEEN.update()
  }

  initModel() {
    // 业务代码
  }
  modelAnimate() {}

  // 渲染器
  initRenderer() {
    const { width, height, bgColor, bgUrl, env } = this.options
    // 创建渲染对象
    const renderer = new THREE.WebGLRenderer(this.options.render)
    // renderer.setClearAlpha( 0 )

    // 环境
    if (env) {
      this.setEnvironment(env)
    }

    // 背景
    if (bgUrl) {
      this.setBgTexture(bgUrl)
    } else {
      this.setBgColor(bgColor)
    }

    if (this.options.fog.visible) {
      const { color, near, far } = this.options.fog
      this.scene.fog = new THREE.Fog(color ?? this.scene.background, near, far)
    }

    // 渲染顺序
    // 开启后模型可以设置 renderOrder 值，依次渲染
    renderer.sortObjects = true

    // 渲染开启阴影 ！！！！
    renderer.shadowMap.enabled = true
    // THREE.BasicShadowMap 性能很好，但质量很差
    // THREE.PCFShadowMap 性能较差，但边缘更光滑
    // THREE.PCFSoftShadowMap 性能较差，但边缘更柔软
    // THREE.VSMShadowMap 更低的性能，更多的约束，可能会产生意想不到的结果
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 设置渲染尺寸
    renderer.setSize(width, height)
    // 设置canvas的分辨率
    renderer.setPixelRatio(window.devicePixelRatio)
    // 画布插入容器
    this.container.appendChild(renderer.domElement)
    return renderer
  }

  // 灯光
  initLight() {
    const { ambientLight, directionalLight, lightHelperVisible } = this.options
    // 环境光
    if (ambientLight.visible) {
      const ambLight = new THREE.AmbientLight(ambientLight.color, ambientLight.intensity)
      this.addObject(ambLight)
    }
    // 平行光
    if (directionalLight.visible) {
      const direLight = this.createDirectionalLight()
      this.addObject(direLight)
      if (lightHelperVisible) {
        const dirLightHelper = new THREE.DirectionalLightHelper(direLight, 1)
        this.addObject(dirLightHelper)
      }

      if (directionalLight.light2) {
        const dirLight2 = this.createDirectionalLight(false)
        dirLight2.position.set(-500, 800, -800)
        this.addObject(dirLight2)
        if (lightHelperVisible) {
          const dirLigh2tHelper = new THREE.DirectionalLightHelper(dirLight2, 1)
          this.addObject(dirLigh2tHelper)
        }
      }
    }
  }

  // 创建平行光
  createDirectionalLight(castShadow: boolean = true, s = 800, size = 4096, near = 1, far = 2000) {
    const { color, intensity } = this.options.directionalLight
    // 平行光
    const dirLight = new THREE.DirectionalLight(color, intensity)
    dirLight.position.set(500, 800, 800)
    if (castShadow) {
      dirLight.shadow.mapSize.setScalar(size)
      dirLight.shadow.bias = -1e-5
      dirLight.shadow.normalBias = 1e-2
      dirLight.castShadow = castShadow
      // 设置阴影贴图模糊度
      const shadowCam = dirLight.shadow.camera
      shadowCam.radius = 10
      shadowCam.near = near
      shadowCam.far = far
      shadowCam.top = shadowCam.right = s
      shadowCam.left = shadowCam.bottom = -s
      // 更新矩阵
      shadowCam.updateProjectionMatrix()
    }

    return dirLight
  }

  // 相机
  initCamera() {
    const { width, height, camera } = this.options
    // 透视投影相机对象 参数（现场角度，窗口长宽比，开始渲染位置，结束渲染位置）
    const cam = new THREE.PerspectiveCamera(36, width / height, camera.near, camera.far)
    // 相机位置
    cam.position.set(...camera.position)
    this.addObject(cam)
    return cam
  }

  // 控制器
  initControls() {
    const controls = this.options.controls
    if (!controls.visible) return
    // 创建控件
    const ctrl = new OrbitControls(this.camera, this.renderer.domElement)
    Object.keys(controls).forEach(key => {
      ctrl[key] = controls[key]
    })
    // 聚焦坐标
    ctrl.target.set(0, 0, 0)
    return ctrl
  }

  // 巡航
  initCruise() {
    const { visible } = this.options.cruise
    if (!visible) return
    this.cruiseCamera = this.initCamera()
    this.#resetCruiseOpts()
  }

  // 网格
  initGrid() {
    const grid = this.options.grid
    if (!grid.visible) return
    const { width, divisions, centerLineColor, gridColor, opacity, transparent } = grid
    // 网格宽度、等分数、中心线颜色、网格颜色
    const gd = new THREE.GridHelper(width, divisions, centerLineColor, gridColor)
    gd.material.opacity = opacity
    gd.material.transparent = transparent
    this.grid = gd
    this.addObject(gd)
  }

  // 坐标辅助器
  initAxes() {
    if (!this.options.axes.visible) return
    // 辅助坐标器
    const axesHelper = new THREE.AxesHelper(this.options.axes.size)
    this.addObject(axesHelper)
  }

  // 重置巡航参数
  #resetCruiseOpts() {
    const cruise = this.options.cruise
    cruise.runing = false
    this.cruiseCamera.lookAt(this.controls.target)
    if (cruise.baseUrl) {
      cruise.baseUrl = this.options.baseUrl
    }
    cruise.factor = 1
    cruise.index = 0
  }

  // 设置巡航点位
  setCruisePoint(points) {
    this.options.cruise.points = points
    this.createCruise()
  }

  // 创建巡航组
  createCruise() {
    const { visible, points } = this.options.cruise
    if (!visible) return
    if (this.cruiseGroup) {
      this.disposeObj(this.cruiseGroup)
    }
    if (!points || points.length == 0) return
    const group = createCruise(this.options.cruise, this.renderer)
    this.cruiseGroup = group
    this.addObject(group)
  }

  // 巡航启动或关闭
  toggleCruise() {
    const { visible, runing } = this.options.cruise
    if (!visible) return
    this.options.cruise.runing = !runing
    this.controls.enabled = runing
    updateCruise(this.options.cruise)
  }

  // 设置缩放
  setScale(s: number) {
    this.options.scale = s
  }

  // 设置环境
  setEnvironment(env) {
    new RGBELoader().load(getUrl(env), texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      // 将加载的材质texture设置给背景和环境
      this.scene.environment = texture
    })
  }

  // 设置背景图
  setBgTexture(bgUrl) {
    if (Array.isArray(bgUrl)) {
      const loader = new THREE.CubeTextureLoader()
      const env = loader.load(getUrl(bgUrl))
      // 设置背景
      this.scene.background = env
    } else {
      this.scene.background = new THREE.TextureLoader().load(getUrl(bgUrl))
    }
  }

  // 设置背景色
  setBgColor(color: number | string) {
    this.scene.background = color ? new THREE.Color(color) : null
  }

  // 绑定事件
  bindEvent() {
    const dom = this.renderer.domElement
    dom.addEventListener('dblclick', this.onDblclick.bind(this))
    dom.addEventListener('pointerdown', this.onPointerDown.bind(this))
    dom.addEventListener('pointermove', this.onPointerMove.bind(this))
    dom.addEventListener('pointerup', this.onPointerUp.bind(this))
  }
  onDblclick(_e: MouseEvent) {}
  onPointerDown(e: PointerEvent) {
    this.pointer.isClick = true
    this.pointer.tsp = e.timeStamp
  }
  onPointerMove(_e: PointerEvent) {}
  onPointerUp(_e: PointerEvent) {
    this.pointer.isClick = false
  }

  // 导出图片
  exportImage() {
    const link = document.createElement('a')
    link.download = 'render.png'
    link.href = this.renderer.domElement.toDataURL().replace('image/png', 'image/octet-stream')
    link.click()
  }

  // 添加对象到场景
  addObject(...objects: object[]) {
    this.scene.add(...objects)
  }

  // 重置画布大小
  resize() {
    // 重新设置宽高
    this.options.width = this.container.offsetWidth || window.innerWidth
    this.options.height = this.container.offsetHeight || window.innerHeight

    const { width, height } = this.options
    const k = width / height
    this.baseCamera.aspect = k
    this.baseCamera.updateProjectionMatrix()
    // 巡航相机
    if (this.cruiseCamera) {
      this.cruiseCamera.aspect = k
      this.cruiseCamera.updateProjectionMatrix()
    }
    this.renderer.setSize(width, height)
  }

  // 停止动画
  stopAnimate() {
    window.cancelAnimationFrame(this.animationId as number)
  }

  // 清除对象
  clear = obj => {
    if (!obj || !obj.traverse) return
    obj.traverse(el => {
      if (el.material) el.material.dispose()
      if (el.geometry) el.geometry.dispose()
      el?.clear()
    })
    obj?.clear()
  }

  // 清除对象缓存
  disposeObj = obj => {
    if (!obj || !obj.traverse) return
    obj.traverse(el => {
      if (el.material) el.material.dispose()

      if (el.geometry) el.geometry.dispose()

      el?.clear()
    })
    obj?.clear()
    this.scene.remove(obj)
  }

  // 销毁
  dispose() {
    try {
      this.scene.clear()
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.content = null
      let gl = this.renderer.domElement.getContext('webgl')
      gl && gl.getExtension('WEBGL_lose_context').loseContext()
    } catch (e) {
      console.log(e)
    }
  }
}