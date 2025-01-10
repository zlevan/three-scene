import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { XYZ } from '../../model'

interface UseCSS3D {
  initCSS3DRender: (
    options: { width: number; height: number },
    container: HTMLElement
  ) => CSS3DRenderer
  createCSS3DDom: (options: {
    name: string
    sprite?: boolean
    className?: string
    position?: [number, number, number]
    onClick?: (e: Event) => void
  }) => (CSS3DSprite | CSS3DObject) & {
    data?: any
    _position_?: XYZ
    isLabel?: boolean
  }
}

// three 场景 cdd 3d 标签
export declare function useCSS3D(): UseCSS3D

export { CSS3DRenderer }
