import * as THREE from 'three'

declare interface UseFence {
  createFence: (model: THREE.Object3D, color: number | string) => THREE.Group
  fenceAnimate: (factor?: number) => void
}

// 电子围栏 fence
export declare function useFence(): UseFence
