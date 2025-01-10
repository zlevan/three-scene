import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import type { XYZ } from '../../../types/model'

// three css 2d 标签
export const useCSS2D = () => {
  // 初始化 CSS2D 标签
  const initCSS2DRender = (options: { width: number; height: number }, container: HTMLElement) => {
    const { width, height } = options
    const CSS2DRender = new CSS2DRenderer()

    // 设置渲染器的尺寸
    CSS2DRender.setSize(width, height)

    // 容器 css 样式
    CSS2DRender.domElement.style.position = 'absolute'
    CSS2DRender.domElement.style.left = '0px'
    CSS2DRender.domElement.style.top = '0px'
    CSS2DRender.domElement.style.pointerEvents = 'none'
    container.appendChild(CSS2DRender.domElement)
    return CSS2DRender
  }

  // 创建 2D 元素
  const createCSS2DDom = (options: {
    name: string
    className?: string
    position?: [number, number, number]
    onClick?: (e: Event, label: InstanceType<typeof CSS2DObject>) => void
  }) => {
    const { name, className = '', onClick, position } = options
    const dom = document.createElement('div')
    dom.innerHTML = name
    dom.className = className

    const label: InstanceType<typeof CSS2DObject> & {
      data?: any
      _position_?: XYZ
    } = new CSS2DObject(dom)
    dom.style.pointerEvents = onClick ? 'auto' : 'none'
    dom.style.position = 'absolute'
    if (typeof onClick === 'function') {
      dom.addEventListener('click', e => onClick(e, label))
    }
    if (position) {
      label.position.set(...position)
    }
    return label
  }

  return {
    initCSS2DRender,
    createCSS2DDom
  }
}

export { CSS2DRenderer }
