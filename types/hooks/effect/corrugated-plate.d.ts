import * as THREE from 'three'

declare interface UseCorrugatedPlate {
  createCorrugatedPlate: (options?: import('../../utils').DeepPartial<Options>) => THREE.Mesh
  update: (mesh: THREE.Mesh, dalte: number) => void
  corrugatedPlateUpdate: (mesh: THREE.Mesh, dalte: number) => void
}

export declare function useCorrugatedPlate(): UseCorrugatedPlate
