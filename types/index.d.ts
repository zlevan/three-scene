export declare interface Fog {
  visible: boolean;
  color: string | number;
  near: number;
  far: number;
}

export declare interface Render {
  antialias: boolean;
  alpha: boolean;
  logarithmicDepthBuffer: boolean;
  preserveDrawingBuffer: boolean;
}

export declare interface Controls {
  visible: boolean;
  enableDamping: boolean;
  dampingFactor: number;
  autoRotate: boolean;
  minPolarAngle: number;
  maxPolarAngle: number;
  enableZoom: boolean;
  enablePan: boolean;
  screenSpacePanning: boolean;
  minDistance: number;
  maxDistance: number;
}

export declare interface AmbientLight {
  visible: boolean;
  color: number | string;
  intensity: number;
}

export declare interface DirectionalLight {
  helper: boolean;
  visible: boolean;
  light2: boolean;
  color: number | string;
  intensity: number;
}

export declare interface Camera {
  helper: boolean;
  near: number;
  far: number;
  position: [number, number, number];
}

export declare interface Grid {
  visible: boolean;
  opacity: number;
  transparent: boolean;
  width: number;
  divisions: number;
  centerLineColor: number | string;
  gridColor: number | string;
}

export declare interface Axes {
  visible: boolean;
  size: number;
}

export declare interface Cruise {
  visible: boolean;
  enabled: boolean;
  runing: boolean;
  points: number[][];
  tension: number;
  baseUrl: string;
  mapUrl: string;
  repeat: number[];
  width: number;
  speed: number;
  mapSpeed: number;
  offset: number;
  factor: number;
  segment: number;
  index: number;
  helper: boolean;
}

export declare interface Options {
  container: HTMLElement | string;
  width: number;
  height: number;
  baseUrl: string;
  scale: number;
  bgColor: number | string;
  bgUrl: string | string[];
  env: string;
  fog: Fog;
  render: Render;

  controls: Controls;
  ambientLight: AmbientLight;
  directionalLight: DirectionalLight;
  camera: Camera;
  cruise: Cruise;
  grid: Grid;
  axes: Axes;
}

export declare type Params = import("./utils").DeepPartial<Options>;
