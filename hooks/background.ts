import { ref } from 'vue'

const getImgUrl = (code, jpg) => {
  return new URL(`../assets/imgs/sky/${code}/${jpg}`, import.meta.url).href
}

// 背景
export const useBackground = (code: string = '') => {
  const skys = ['216', '217', '218', '219', '220', '221', '222', '223', '224', '225']
  const i = skys.findIndex(t => t == code)
  const index = ref(i < 0 ? 0 : i)
  const change = scene => {
    const code = skys[index.value]
    if (!code) return
    load(scene, code)
    index.value++
    if (index.value >= skys.length) index.value = 0
  }

  // 获取背景组图
  const getBgGroup = code => {
    return ['posX.jpeg', 'negX.jpeg', 'posY.jpeg', 'negY.jpeg', 'posZ.jpeg', 'negZ.jpeg'].map(u => getImgUrl(code, u))
  }

  // 加载 -配合场景使用
  const load = (scene, code) => {
    scene?.setBgTexture(getBgGroup(code))
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
