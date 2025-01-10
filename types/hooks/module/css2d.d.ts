import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { XYZ } from '../../model'

interface UseCSS2D {
  initCSS2DRender: (
    options: { width: number; height: number },
    container: HTMLElement
  ) => CSS2DRenderer
  createCSS2DDom: (options: {
    name: string
    className?: string
    position?: [number, number, number]
    onClick?: (e: Event, label: CSS2DObject) => void
  }) => CSS2DObject & {
    data?: any
    _position_?: XYZ
  }
}

// three css 2d 标签
export declare function useCSS2D(): UseCSS2D

export { CSS2DRenderer }
