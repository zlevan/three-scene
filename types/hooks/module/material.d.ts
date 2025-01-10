import * as THREE from 'three'

import type { ReplaceOpts } from '../../material'

interface UseMaterial {
  materialReplace: (group: any, opts: ReplaceOpts, child: any, color?: number | string) => void
  changeTransparent: (mode: THREE.Mesh, opacity: number) => void
  exportGlb: (model: any, animations: any[], name: string, isGlb?: boolean) => void
  getAnimations: (model: any) => any[]
  setMetalnessMaterial: (
    mat: any,
    metalness: number,
    roughness: number
  ) => THREE.MeshStandardMaterial
  setGlassMaterial: (
    mat: any,
    options: {
      metalness: number
      roughness: number
      envMapIntensity: number
      transmission: number
      ior: number
    }
  ) => THREE.MeshPhysicalMaterial
  centerBoxHelper: (
    model: any,
    hex?: number | string
  ) => {
    helper: THREE.BoxHelper
    center: THREE.Vector3
  }
}

// 材质 material
export declare function useMaterial(): UseMaterial
