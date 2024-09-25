export default {
  container: document.body,
  width: window.innerWidth,
  height: window.innerHeight,
  // 基础地址（资源地址）
  baseUrl: '',
  // 背景 (背景透明需要 render 参数 alpha 为 true)
  bgColor: null,
  // 背景图
  bgUrl: null,
  // 环境
  env: null,
  // 缩放(父元素缩放)
  scale: 1,
  // 雾
  fog: {
    visible: false,
    near: 100,
    far: 1000
  },
  // 渲染器配置
  render: {
    // 是否开启反锯齿，设置为true开启反锯齿
    antialias: true,
    // 透明度
    // alpha: true,
    // 设置对数深度缓存
    // 解决 模型相接处或某些区域出现频闪问题或内容被相邻近元素覆盖掉的情况
    logarithmicDepthBuffer: true,
    // 截图设置, true 时性能会下降
    preserveDrawingBuffer: false
  },
  // 控制
  controls: {
    // 是否开启
    visible: true,
    // 阻尼
    enableDamping: false,
    // 阻尼系数，鼠标灵敏度
    dampingFactor: 0.25,
    // 自动旋转
    autoRotate: false,
    // 相机垂直旋转角度的上限
    // maxPolarAngle: Math.PI * 0.46,

    // 缩放
    enableZoom: true,
    // 右键拖拽
    enablePan: true,
    // 垂直平移
    screenSpacePanning: true,
    // 相机距离远点最近距离
    minDistance: 1,
    // 相机距离远点最远距离
    maxDistance: 2000
  },
  // 灯光辅助
  lightHelperVisible: false,
  ambientLight: {
    visible: true,
    color: 0xffffff,
    // 强度
    intensity: 1.5
  },
  // 平行光
  directionalLight: {
    visible: true,
    light2: true,
    color: 0xffffff,
    intensity: 1.5
  },
  // 相机
  camera: {
    // 近
    near: 1,
    // 远
    far: 10000,
    position: [-350, 510, 700]
  },
  // 巡航
  cruise: {
    visible: false,
    // 激活
    enabled: false,
    // 运行中
    runing: false,
    // 辅助
    helper: false,
    // 点位
    points: [],
    // 分段
    segment: 2,
    // 曲线张力
    tension: 0,
    // 基础地址
    baseUrl: '',
    // 贴图地址
    mapUrl: '/oss/textures/cruise/arrow.png',
    // 贴图重复
    repeat: [0.1, 1],
    // 宽度
    width: 15,
    // 动画速度
    speed: 1,
    // 贴图速度
    mapSpeed: 0.006,
    //  巡航偏差
    offset: 10,
    // 系数
    factor: 1,
    // 索引
    index: 0
  },
  // 网格
  grid: {
    visible: false,
    opacity: 0.3,
    transparent: true,
    width: 800,
    // 等分数
    divisions: 80,
    // 中心线颜色
    centerLineColor: 0xa1a1a1,
    // 网格颜色
    gridColor: 0xa1a1a1
  },
  axes: {
    visible: false,
    size: 50
  }
}
