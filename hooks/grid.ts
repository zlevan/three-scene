import * as THREE from 'three'

import type { Grid } from '../types'
type Options = Pick<Grid, 'width' | 'divisions' | 'forkColor' | 'forkSize'>

export declare type Params = import('../types/utils').DeepPartial<Options>

// 网格交叉
export const useGrid = () => {
  const createFork = (options: Params = {}) => {
    const { width = 800, divisions = 80, forkSize = 1.4, forkColor = 0xa1a1a1 } = options
    let step = width / divisions,
      start = -width / 2
    const group = new THREE.Group()
    for (let i = 0; i <= divisions; i++) {
      for (let j = 0; j <= divisions; j++) {
        const x = start + i * step
        const z = start + j * step
        const geo = new THREE.PlaneGeometry(forkSize, forkSize / 5)
        // 边框材质
        const mat = new THREE.MeshLambertMaterial({
          color: forkColor,
          transparent: true,
          opacity: 0.9
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotateX(-Math.PI * 0.5)
        mesh.position.set(x, 0, z)
        const mesh2 = mesh.clone()
        mesh2.rotateZ(Math.PI * 0.5)
        group.add(mesh, mesh2)
      }
    }
    return group
  }

  return {
    createFork
  }
}
