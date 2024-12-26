export interface Fog {
  visible: boolean
  color: string | number
  near: number
  far: number
}

export interface Render {
  antialias: boolean
  alpha: boolean
  logarithmicDepthBuffer: boolean
  preserveDrawingBuffer: boolean
}

export interface Controls {
  visible: boolean
  autoRotate: boolean
  autoRotateSpeed: number
  enableDamping: boolean
  dampingFactor: number
  enablePan: boolean
  enableRotate: boolean
  enableZoom: boolean
  maxAzimuthAngle: number
  minAzimuthAngle: number
  minDistance: number
  maxDistance: number
  minPolarAngle: number
  maxPolarAngle: number
  maxTargetRadius: number
  rotateSpeed: number
  screenSpacePanning: boolean
}

export interface AmbientLight {
  visible: boolean
  color: number | string
  intensity: number
}

export interface DirectionalLight {
  helper: boolean
  visible: boolean
  position: number[]
  position2: number[]
  light2: boolean
  color: number | string
  intensity: number
}

export interface Camera {
  helper: boolean
  near: number
  far: number
  orthogonal: boolean
  position: [number, number, number]
}

export interface Grid {
  visible: boolean
  opacity: number
  transparent: boolean
  width: number
  divisions: number
  centerLineColor: number | string
  gridColor: number | string
  fork: boolean
  forkSize: number
  forkColor: number | string
}

export interface Axes {
  visible: boolean
  size: number
}

export interface Cruise {
  visible: boolean
  enabled: boolean
  runing: boolean
  points: number[][]
  tension: number
  baseUrl: string
  mapUrl: string
  repeat: number[]
  width: number
  speed: number
  mapSpeed: number
  offset: number
  factor: number
  segment: number
  index: number
  helper: boolean
  close: boolean
  auto: boolean
  tube: boolean
  color: string | number
  radius: number
  radialSegments: number
  alway: boolean
  animateBack:
    | ((position: any, lookAt: any, cruiseCurve: any, progress: number) => void)
    | undefined
}

export interface Options {
  container: HTMLElement | string
  width: number
  height: number
  baseUrl: string
  scale: number
  bgColor: number | string
  bgUrl: string | string[]
  env: string
  fog: Fog
  render: Render

  controls: Controls
  ambientLight: AmbientLight
  directionalLight: DirectionalLight
  camera: Camera
  cruise: Cruise
  grid: Grid
  axes: Axes
}

export type Params = import('./utils').DeepPartial<Options>
