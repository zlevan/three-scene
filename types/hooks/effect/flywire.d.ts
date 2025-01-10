import * as THREE from 'three'

import type { Options } from '../../flywire'

declare interface UseFlywire {
  createFlywireTexture: (options?: import('../../utils').DeepPartial<Options>) => void
  createFlywire: (coords: import('../../utils').getType<Options, 'coords'>) => THREE.Group
  update: () => void
  flywireUpdate: () => void
}

// 飞线
export declare function useFlywire(options?: import('../../utils').DeepPartial<Options>): UseFlywire
