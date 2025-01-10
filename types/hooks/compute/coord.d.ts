import * as THREE from 'three'

interface Box {
  box3: THREE.Box3
  center: THREE.Vector3
  size: THREE.Vector3
}

interface UseCoord {
  getBoundingBox: (group: THREE.Object3D) => Box
}

// 碰撞 collide
export declare function useCoord(): UseCoord
