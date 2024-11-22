import * as THREE from 'three'

// 光线投射
export const useRaycaster = () => {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const style = {
    left: 0,
    top: 0
  }

  const update = (e: PointerEvent, dom: Element, scale = 1) => {
    // 获取元素偏移量
    const rect = dom.getBoundingClientRect() || { left: 0, top: 0 }
    // 渲染元素作为子组件可能有缩放处理，元素大小需要计算处理

    // 设置二维向量坐标 （-1， 1 范围）
    pointer.x = ((e.clientX - rect.left) / (dom.clientWidth * scale)) * 2 - 1
    pointer.y = -((e.clientY - rect.top) / (dom.clientHeight * scale)) * 2 + 1

    const halfw = dom.clientWidth / 2
    const halfh = dom.clientHeight / 2
    // 二维坐标 (没有加偏移量因为 css 父级又相对定位)
    style.left = pointer.x * halfw + halfw
    style.top = -pointer.y * halfh + halfh
  }

  // 平面转 3D 世界坐标
  const screenToWorld = (e: PointerEvent, dom: Element, camera, hyper_z, scale = 1) => {
    update(e, dom, scale)

    const vector = new THREE.Vector3()
    vector.set(pointer.x, pointer.y, hyper_z)
    vector.unproject(camera)
    vector.applyMatrix4(camera.matrixWorldInverse)
    return vector
  }

  return {
    raycaster,
    pointer,
    style,
    update,
    screenToWorld
  }
}
