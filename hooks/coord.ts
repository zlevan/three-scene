import * as THREE from 'three'

export const useCoord = () => {
  // 计算包围盒
  const getBoundingBox = group => {
    // 包围盒计算模型对象的大小和位置
    var box3 = new THREE.Box3()
    box3.expandByObject(group) // 计算模型包围盒
    var size = new THREE.Vector3()
    box3.getSize(size) // 计算包围盒尺寸
    var center = new THREE.Vector3()
    box3.getCenter(center) // 计算一个层级模型对应包围盒的几何体中心坐标
    return {
      box3,
      center,
      size
    }
  }
  return {
    getBoundingBox
  }
}
