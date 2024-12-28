import { ref } from 'vue'
import * as THREE from 'three'

const getImgUrl = (code: string, jpg: string) => {
  return new URL(`three-scene/src/assets/imgs/sky/${code}/${jpg}`, import.meta.url).href
}

const skys = ['216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226'] as const

// 背景
export const useBackground = (code?: (typeof skys)[number]) => {
  const i = skys.findIndex(t => t == code)
  const index = ref(i < 0 ? 0 : i)
  const change = (scene: any) => {
    const code = skys[index.value]
    if (!code) return
    load(scene, code)
    index.value++
    if (index.value >= skys.length) index.value = 0
  }

  // 获取背景组图
  const getBgGroup = (code: (typeof skys)[number]) => {
    return ['posX.jpeg', 'negX.jpeg', 'posY.jpeg', 'negY.jpeg', 'posZ.jpeg', 'negZ.jpeg'].map(u =>
      getImgUrl(code, u)
    )
  }

  // 加载 -配合场景使用
  const load = (scene: any, code: (typeof skys)[number]) => {
    const bgUrl = getBgGroup(code)
    if (typeof scene.setBgTexture === 'function') {
      scene.setBgTexture(bgUrl)
    } else {
      if (Array.isArray(bgUrl)) {
        const loader = new THREE.CubeTextureLoader()
        const env = loader.load(bgUrl)
        // 设置背景
        scene.background = env
      } else {
        scene.background = new THREE.TextureLoader().load(bgUrl)
      }
    }
  }
  return {
    skys,
    index,
    change,
    changeBackground: change,
    load,
    getBgGroup,
    backgroundLoad: load
  }
}
