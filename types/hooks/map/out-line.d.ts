import * as THREE from 'three'
import type { Options } from '../../out-line'

interface UseOutline {
  createOutline: (
    points: number[],
    options?: import('../../utils').DeepPartial<Options>
  ) => THREE.Points
  update: (mesh: any) => void
  outlineUpdate: (mesh: any) => void
}

// 边缘线(地图 边界) out-line
export declare function useOutline(options?: import('../../utils').DeepPartial<Options>): UseOutline
