import * as THREE from 'three'
import type { Options } from '../../open-the-door'

interface UseOpenTheDoor {
  dubleHorizontal: (
    scene: THREE.Scene,
    options: import('../../utils').DeepPartial<Options>
  ) => Promise<any>
  oddRotate: (
    scene: THREE.Scene,
    options: import('../../utils').DeepPartial<Options>
  ) => Promise<any>
  dubleRotate: (
    scene: THREE.Scene,
    options: import('../../utils').DeepPartial<Options>
  ) => Promise<any>
}

// 开门 open-the-door
export declare function useOpenTheDoor(): UseOpenTheDoor
