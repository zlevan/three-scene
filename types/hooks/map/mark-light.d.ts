import * as THREE from 'three'

import type { Options } from '../../mark-light'

interface UseMarkLight {
  createMarkLight: (
    position?: number[],
    height?: number,
    options?: import('../../utils').DeepPartial<Options>
  ) => THREE.Group
}

// 光柱
export declare function useMarkLight(
  options?: import('../../utils').DeepPartial<Options>
): UseMarkLight
