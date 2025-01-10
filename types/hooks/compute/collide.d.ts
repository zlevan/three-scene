import * as THREE from 'three'

interface UseCollide {
  checkCollide: (
    target: THREE.Object3D,
    pos: THREE.Vector3,
    objects: any,
    recursive: boolean,
    upVector: THREE.Vector3
  ) => THREE.Intersection<THREE.Object3D>[]
}

// 碰撞 collide
export declare function useCollide(): UseCollide
