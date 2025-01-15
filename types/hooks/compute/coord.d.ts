import * as THREE from 'three'

interface Box {
  box3: THREE.Box3
  center: THREE.Vector3
  size: THREE.Vector3
}

interface UseCoord {
  /**
   * 获取包围盒子
   * @param { THREE.Object3D } group 计算盒子的对象或者组
   * @returns { Box }
   */
  getBoundingBox: (group: THREE.Object3D) => Box
}

/**
 * 坐标 coord
 */
export function useCoord(): UseCoord
