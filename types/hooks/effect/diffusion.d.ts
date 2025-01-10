import * as THREE from 'three'

declare interface UseDiffusion {
  createDiffusion: (
    width?: number,
    color?: number | string,
    circle?: number
  ) => THREE.Mesh
  updateDiffusion: (factor?: number) => void
}

// 扩散波 diffusion
export declare function useDiffusion(): UseDiffusion
