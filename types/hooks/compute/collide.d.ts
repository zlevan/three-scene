import * as THREE from 'three'

interface UseCollide {
  /**
   * 检测碰撞
   * @param { Object3D } target 检测目标
   * @param { Vector3 } position 坐标
   * @param { Object3D[] } objects 检测的对象集合
   * @param { boolean } recursive  是否检测子集
   * @param  { Vector3 } upVector 向上向量（检测碰撞高度）
   * @returns { Object3D[] } intersects 碰撞几何体集合
   * @example
   * ```typescript
   *  const intersects = checkCollide(
   *    target,
   *    position,
   *    buildingGroup?.children || [],
   *    true,
   *    new THREE.Vector3(0, 2, 0)
   *  )
   * ```
   */
  checkCollide: (
    target: THREE.Object3D,
    position: THREE.Vector3,
    objects: THREE.Object3D[],
    recursive: boolean,
    upVector: THREE.Vector3
  ) => THREE.Intersection<THREE.Object3D>[]
}

/**
 * 碰撞 collide
 */
export function useCollide(): UseCollide
