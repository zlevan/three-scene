import * as THREE from 'three'

// 碰撞 collide
export const useCollide = () => {
  // 检测射线
  const raycaster = new THREE.Raycaster()
  // 向量
  const up = new THREE.Vector3(0, 2, 0)

  // 检测碰撞（目标、坐标、检测的对象集合、是否检测子集）
  const checkCollide = (
    target: InstanceType<typeof THREE.Object3D>,
    position: InstanceType<typeof THREE.Vector3>,
    objects: InstanceType<typeof THREE.Object3D>[],
    recursive = true,
    upVector = up
  ) => {
    // 当前目标坐标,Y轴加一个固定向量，代表纵轴射线发射（检测碰撞的）位置
    const origin = position.clone().add(upVector)
    // 获取目标朝向
    const direction = new THREE.Vector3()
    target.getWorldDirection(direction)
    direction.normalize()

    // 设置射线发射位置
    raycaster.ray.origin.copy(origin)
    // 设置射线发射方向
    raycaster.ray.direction.copy(direction)
    // 开始【前、后】检测：对于blender制作的模型，需要递归遍历所有child，否则无法实现射线碰撞检测{[childs], true}
    const intersects = raycaster.intersectObjects(objects, recursive)
    return intersects
  }

  return {
    checkCollide
  }
}
