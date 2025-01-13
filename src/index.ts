import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { deepMerge, isDOM, getUrl } from './utils'
import defOptions from './options'

import { useCruise, useGrid } from './hooks'

import type { XYZ } from '../types/model'

const { createCruise, cruiseAnimate, updateCruise, bindEvent, removeEvent } = useCruise()
const { createFork } = useGrid()
export class Scene {
  // 配置
  options: import('../types/options').Options
  // 容器
  container: HTMLElement
  // 场景
  scene: InstanceType<typeof THREE.Scene>
  // 渲染器
  renderer: InstanceType<typeof THREE.WebGLRenderer>
  // 基础相机
  baseCamera:
    | InstanceType<typeof THREE.PerspectiveCamera>
    | InstanceType<typeof THREE.OrthographicCamera>
  // 巡航相机
  cruiseCamera?:
    | InstanceType<typeof THREE.PerspectiveCamera>
    | InstanceType<typeof THREE.OrthographicCamera>
  // 巡航组
  cruiseGroup?: InstanceType<typeof THREE.Group>
  // 控制器
  controls?: InstanceType<typeof OrbitControls>
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

  // 时间
  clock?: InstanceType<typeof THREE.Clock>

  constructor(options: import('../types/options').Params = {}) {
    // 默认配置
    const defaultOpts = defOptions
    // 配置
    this.options = deepMerge(defaultOpts, options)

    Scene.total++

    this.pointer = {
      tsp: 0,
      isClick: false
    }

    // 容器
    if (isDOM(this.options.container)) {
      this.container = this.options.container as HTMLElement
    } else {
      if (!this.options.container) {
        this.container = document.body
      } else {
        this.container = document.querySelector(this.options.container as string) as HTMLElement
      }
    }

    this.options.width = this.container.offsetWidth
    this.options.height = this.container.offsetHeight
    this.scene = this.createScene()

    this.renderer = this.initRenderer()
    this.baseCamera = this.initCamera()
    this.controls = this.initControls()
    this.init()
    this.initCruise()
    console.log(this)
  }

  get camera() {
    const { visible, runing, auto } = this.options.cruise
    if (!visible || !this.cruiseCamera) return this.baseCamera
    // 自动巡航
    if (auto) {
      return runing ? this.cruiseCamera : this.baseCamera
    }
    // 非自动巡航且运行中
    return runing ? this.cruiseCamera : this.baseCamera
  }

  init() {
    this.initBg()
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
    if (this.options.controls.visible) this.controls?.update()

    cruiseAnimate(this.cruiseCamera)

    TWEEN.update()
  }

  initModel() {
    // 业务代码
  }
  modelAnimate() {}

  createScene() {
    return new THREE.Scene()
  }

  createRender() {
    return new THREE.WebGLRenderer(this.options.render)
  }

  // 渲染器
  initRenderer() {
    const { width, height } = this.options
    // 创建渲染对象
    const renderer = this.createRender()
    // renderer.setClearAlpha( 0 )

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

  // 背景
  initBg() {
    const { bgColor, bgUrl, env } = this.options

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
  }

  // 灯光
  initLight() {
    const { ambientLight, directionalLight } = this.options
    // 环境光
    if (ambientLight.visible) {
      const ambLight = new THREE.AmbientLight(ambientLight.color, ambientLight.intensity)
      this.addObject(ambLight)
    }
    // 平行光
    if (directionalLight.visible) {
      const direLight = this.createDirectional()
      const [x = 0, y = 0, z = 0] = directionalLight.position
      direLight.position.set(x, y, z)
      this.addObject(direLight)
      if (directionalLight.helper) {
        const dirLightHelper = new THREE.DirectionalLightHelper(direLight, 1)
        this.addObject(dirLightHelper)
      }

      if (directionalLight.light2) {
        const dirLight2 = this.createDirectional(false)
        const [x = 0, y = 0, z = 0] = directionalLight.position2
        dirLight2.position.set(x, y, z)
        this.addObject(dirLight2)
        if (directionalLight.helper) {
          const dirLigh2tHelper = new THREE.DirectionalLightHelper(dirLight2, 1)
          this.addObject(dirLigh2tHelper)
        }
      }
    }
  }

  // 平行光
  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  // 创建平行光
  createDirectional(castShadow: boolean = true, s = 2000, size = 4096, near = 0.1, far = 20000) {
    const { color, intensity } = this.options.directionalLight
    // 平行光
    const dirLight = this.createDirectionalLight(color, intensity)

    if (castShadow) {
      dirLight.shadow.mapSize.setScalar(size)
      dirLight.shadow.bias = -1e-5
      dirLight.shadow.normalBias = 1e-2
      dirLight.castShadow = castShadow
      // 设置阴影贴图模糊度
      const shadowCam = dirLight.shadow.camera
      // shadowCam.radius = 10
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
    let cam:
      | InstanceType<typeof THREE.PerspectiveCamera>
      | InstanceType<typeof THREE.OrthographicCamera> = new THREE.PerspectiveCamera(
      36,
      width / height,
      camera.near,
      camera.far
    )

    if (camera.orthogonal) {
      let k = width / height,
        s = 260
      // 创建相机对象 参数（左边界，右边界，上边界，下边界，开始渲染位置，结束渲染位置）
      cam = new THREE.OrthographicCamera(-s * k, s * k, s, -s, camera.near, camera.far)
    }

    // 相机位置
    cam.position.set(...camera.position)
    // 未添加控制轨道则需要设置 lookat 否则渲染无效
    cam.lookAt(0, 0, 0)
    if (camera.helper) {
      const helper = new THREE.CameraHelper(cam)
      this.addObject(helper)
    }

    return cam
  }

  // 控制器
  initControls() {
    const controls = this.options.controls
    if (!controls.visible) return
    // 创建控件
    const ctrl = new OrbitControls(this.camera, this.renderer.domElement)
    Object.keys(controls).forEach(key => {
      // @ts-ignore
      ctrl[key] = controls[key]
    })
    // 聚焦坐标
    ctrl.target.set(0, 0, 0)
    // 保存状态
    ctrl.saveState()
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
    const { width, divisions, centerLineColor, gridColor, opacity, transparent, fork } = grid
    // 网格宽度、等分数、中心线颜色、网格颜色
    const gd = new THREE.GridHelper(width, divisions, centerLineColor, gridColor)
    gd.material.opacity = opacity
    gd.material.transparent = transparent
    this.grid = gd
    this.addObject(gd)
    // 交叉
    if (fork) {
      const group = createFork(grid)
      this.addObject(group)
    }
  }

  // 坐标辅助器
  initAxes() {
    if (!this.options.axes.visible) return
    // 辅助坐标器
    const axesHelper = new THREE.AxesHelper(this.options.axes.size)
    this.addObject(axesHelper)
  }

  // 创建地面
  createGround(sizeX = 5000, sizeY?: number, color = 0xb2dbdb) {
    sizeY = sizeY === void 0 ? sizeX : sizeY
    const geo = new THREE.PlaneGeometry(sizeX, sizeY)
    const mat = new THREE.MeshPhongMaterial({
      color,
      shininess: 10 // 高亮阈值
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'ground'
    mesh.rotation.x = Math.PI * 1.5
    // 接收阴影
    mesh.receiveShadow = true
    return mesh
  }

  // 创建时间
  createClock() {
    this.clock = new THREE.Clock()
  }

  // 重置巡航参数
  #resetCruiseOpts() {
    const cruise = this.options.cruise
    cruise.enabled = false
    cruise.runing = false

    if (cruise.baseUrl) {
      cruise.baseUrl = this.options.baseUrl
    }
    cruise.factor = 1
  }

  // 设置巡航点位
  setCruisePoint(points: number[][]) {
    this.options.cruise.points = points
    this.createCruise()
  }

  // 创建巡航组
  createCruise() {
    const { visible, points, alway } = this.options.cruise
    if (!visible) return
    if (this.cruiseGroup) {
      this.disposeObj(this.cruiseGroup)
    }
    bindEvent()
    if (!points || points.length == 0) return
    const group = createCruise(this.options.cruise, this.renderer)
    this.cruiseGroup = group
    group.visible = alway
    this.addObject(group)
  }

  // 巡航启动或关闭
  toggleCruise(close?: boolean) {
    let { visible, runing, auto, alway } = this.options.cruise
    if (!visible) return
    runing = close != void 0 ? close : runing

    this.options.cruise.runing = !runing
    this.options.cruise.enabled = !runing
    this.controls && (this.controls.enabled = auto || runing)
    this.cruiseGroup && !alway && (this.cruiseGroup.visible = !runing)
    updateCruise(this.options.cruise)
  }

  // 开启或关闭巡航深度测试
  toggleCruiseDepthTest(depthTest?: boolean) {
    if (!this.cruiseGroup) return
    this.cruiseGroup.traverse((el: any) => {
      if (el.isMesh || el.isLine) {
        el.material.depthTest = depthTest != void 0 ? depthTest : !el.material.depthTest
      }
    })
  }

  // 设置缩放
  setScale(s: number) {
    this.options.scale = s
  }

  // 设置环境
  setEnvironment(hdrUrl: string) {
    new RGBELoader().load(getUrl(hdrUrl, this.options.baseUrl) as string, texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      // 将加载的材质texture设置给背景和环境
      this.scene.environment = texture
    })
  }

  // 设置背景图
  setBgTexture(bgUrl: string | string[]) {
    if (Array.isArray(bgUrl)) {
      const loader = new THREE.CubeTextureLoader()
      const env = loader.load(getUrl(bgUrl, this.options.baseUrl) as string[])
      // 设置背景
      this.scene.background = env
    } else {
      this.scene.background = new THREE.TextureLoader().load(getUrl(bgUrl) as string)
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

  // 获取场景坐标
  getPosition() {
    console.log('camera.position', this.camera.position)
    console.log('controls.target', this.controls?.target)
    return {
      position: this.camera.position,
      target: this.controls?.target
    }
  }

  // 判断相机位置是否移动
  isCameraMove(to: XYZ, distance = 1) {
    const pos = this.camera.position
    // 坐标差距小于 threshold 则未移动
    return (
      Math.abs(pos.x - to.x) < distance &&
      Math.abs(pos.y - to.y) < distance &&
      Math.abs(pos.z - to.z) < distance
    )
  }

  // 添加对象到场景
  addObject(...objects: any[]) {
    this.scene.add(...objects)
  }

  // 控制保存
  controlSave() {
    this.controls?.saveState()
  }

  // 控制重置
  controlReset() {
    this.controls?.reset()
    this.toggleCruise(true)
  }

  // 获取有效的目标点 并设置中心点
  getValidTargetPosition(
    config: {
      to?: XYZ
      target?: XYZ
    },
    _to?: XYZ,
    _target?: XYZ,
    defaultTo: XYZ = {
      x: -104,
      y: 7,
      z: 58
    }
  ) {
    const to = _to || config.to || defaultTo
    const target = _target || config.target || { x: 0, y: 0, z: 0 }
    const ctr = this.controls
    if (ctr && ctr.target) {
      // 中心点位
      ctr.target.set(target.x, target.y, target.z)
    }
    return to
  }

  // 重置画布大小
  resize() {
    // 重新设置宽高
    this.options.width = this.container.offsetWidth || window.innerWidth
    this.options.height = this.container.offsetHeight || window.innerHeight

    const { width, height, camera } = this.options
    const k = width / height

    if (!camera.orthogonal) {
      // @ts-ignore
      this.baseCamera.aspect = k
    }
    this.baseCamera.updateProjectionMatrix()
    // 巡航相机
    if (this.cruiseCamera) {
      if (!camera.orthogonal) {
        // @ts-ignore
        this.cruiseCamera.aspect = k
      }
      this.cruiseCamera.updateProjectionMatrix()
    }
    this.renderer.setSize(width, height)
  }

  // 停止动画
  stopAnimate() {
    window.cancelAnimationFrame(this.animationId as number)
  }

  // 清除对象
  clear(obj: any) {
    if (!obj || !obj.traverse) return
    obj.traverse((el: any) => {
      if (el.material) el.material.dispose()
      if (el.geometry) el.geometry.dispose()
      el?.clear()
    })
    obj?.clear()
  }

  // 销毁对象
  disposeObj(obj: any) {
    if (!obj || !obj.traverse) return
    obj.traverse((el: any) => {
      if (el.material) el.material.dispose()

      if (el.geometry) el.geometry.dispose()

      el?.clear()
    })
    obj?.clear()
    this.scene.remove(obj)
  }

  // 销毁场景
  dispose() {
    removeEvent()
    this.stopAnimate()
    try {
      THREE.Cache.clear()
      this.disposeObj(this.scene)
      this.scene.clear()

      if (!(this.renderer as any).isWebGPURenderer) {
        this.renderer.dispose()
      }
      if (typeof this.renderer.forceContextLoss === 'function') {
        this.renderer.forceContextLoss()
      }

      let gl = this.renderer.domElement.getContext('webgl')
      gl && gl.getExtension('WEBGL_lose_context')?.loseContext()

      this.disposeObj(this.cruiseGroup)
      if (this.controls) this.controls.dispose()
      // this.disposeObj(this.grid)

      // @ts-ignore
      this.scene = void 0
      // @ts-ignore
      this.renderer = void 0
      // @ts-ignore
      this.baseCamera = void 0
      this.cruiseCamera = void 0
      this.controls = void 0
      this.grid = void 0
      this.cruiseGroup = void 0
      this.container.innerHTML = ''
    } catch (e) {
      console.log(e)
    }
  }
}
