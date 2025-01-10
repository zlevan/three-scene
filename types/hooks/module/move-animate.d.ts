import * as THREE from 'three'
import type { XYZ } from '../../model'

interface UseMoveAnimate {
  createMove: (
    model: any,
    moveTo: THREE.Vector3,
    rungingCall?: (pos: XYZ, stop: () => void) => void,
    endCallback?: (pos: XYZ) => void
  ) => void
  moveAnimate: (factor: number) => void
}

// 移动动画 move-animate
export declare function useMoveAnimate(): UseMoveAnimate
