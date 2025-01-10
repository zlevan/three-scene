import * as THREE from 'three'

interface Style {
  left: number
  top: number
}

interface UseRaycaster {
  raycaster: THREE.Raycaster
  pointer: THREE.Vector2
  style: Style
  update: (e: PointerEvent, dom: Element, scale: number) => void
}

// 光线投射 平面坐标于 3D 坐标转换
export declare function useRaycaster(): UseRaycaster
