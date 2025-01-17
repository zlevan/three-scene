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
    // 近
    near: 100,
    // 远
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
    // 自动旋转
    autoRotate: false,
    // 自动旋转速度
    autoRotateSpeed: 2.0,
    // 阻尼(惯性)
    enableDamping: false,
    // 阻尼系数，鼠标灵敏度
    dampingFactor: 0.25,

    // 相机平移（右键拖拽）
    enablePan: true,
    // 相机旋转
    enableRotate: true,
    // 缩放
    enableZoom: true,

    // 旋转角度上限
    maxAzimuthAngle: Infinity,
    // 旋转角度下限
    minAzimuthAngle: Infinity,
    // 相机最近距离
    minDistance: 1,
    // 相机最远距离
    maxDistance: 2000,

    // 垂直角度下限
    minPolarAngle: 0,
    // 垂直角度上限
    maxPolarAngle: Math.PI,
    // 目标移动半径
    maxTargetRadius: Infinity,

    // 旋转速度
    rotateSpeed: 1,
    // 空间内平移/垂直平面平移
    screenSpacePanning: true
  },
  // 环境光
  ambientLight: {
    visible: true,
    color: 0xffffff,
    // 强度
    intensity: 1.5
  },
  // 平行光
  directionalLight: {
    visible: true,
    // 辅助
    helper: false,
    // 坐标
    position: [500, 1000, 800],
    position2: [-500, 800, -800],
    // 平行光 2 开启
    light2: true,
    // 颜色
    color: 0xffffff,
    // 强度
    intensity: 1.5
  },
  // 相机
  camera: {
    // 辅助
    helper: false,
    // 近
    near: 1,
    // 远
    far: 10000,
    // 摄像机视锥体垂直视野角度
    fov: 36,
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
    // mapUrl: '',
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
    // 自动巡航(可从动画函数执行机器人巡航)
    auto: false,
    // 帧动画回调
    animateBack: void 0,
    // 一直显示路线（默认巡航中展示路线）
    alway: false
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
    gridColor: 0xa1a1a1,
    // 交叉
    fork: false,
    forkSize: 1.4,
    forkColor: 0xa1a1a1
  },
  axes: {
    visible: false,
    size: 50
  }
}
