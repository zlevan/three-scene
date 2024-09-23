import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export const useCSS3D = () => {
  // 初始化 CSS3D 标签
  const initCSS3DRender = (options: { width: number; height: number }, container: HTMLElement) => {
    const { width, height } = options
    const CSS3DRender = new CSS3DRenderer()
    // 设置渲染器的尺寸
    CSS3DRender.setSize(width, height)
    // 容器 css 样式
    CSS3DRender.domElement.style.position = 'absolute'
    CSS3DRender.domElement.style.left = '0px'
    CSS3DRender.domElement.style.top = '0px'
    CSS3DRender.domElement.style.pointerEvents = 'none'
    container.appendChild(CSS3DRender.domElement)
    return CSS3DRender
  }

  // 创建 3D 元素
  const createCSS3DDom = (options: {
    name: string
    sprite?: boolean
    className?: string
    position?: [number, number, number]
    onClick?: (e: Event) => void
  }) => {
    const { name, className = '', onClick, position, sprite } = options
    const dom = document.createElement('div')
    dom.innerHTML = name
    dom.className = className

    const label = sprite ? new CSS3DSprite(dom) : new CSS3DObject(dom)
    dom.style.pointerEvents = onClick ? 'auto' : 'none'
    dom.style.position = 'absolute'
    if (typeof onClick === 'function') {
      dom.addEventListener('click', onClick)
    }
    if (position) {
      label.position.set(...position)
    }
    return label
  }

  return {
    initCSS3DRender,
    createCSS3DDom
  }
}

export { CSS3DRenderer }
