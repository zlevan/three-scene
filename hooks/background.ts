import { ref } from 'vue'

// 背景
export const useBackground = (code: string = '') => {
  const skys = ['216', '217', '218', '219', '220', '221', '222', '223', '224', '225']
  const skyPath = ref('/oss/img/sky')
  const i = skys.findIndex(t => t == code)
  const index = ref(i < 0 ? 0 : i)
  const change = scene => {
    const code = skys[index.value]
    if (!code) return
    load(scene, code)
    index.value++
    if (index.value >= skys.length) index.value = 0
  }

  const load = (scene, code) => {
    scene?.setBgTexture(
      [`/posX.jpeg`, `/negX.jpeg`, `/posY.jpeg`, `/negY.jpeg`, `/posZ.jpeg`, `/negZ.jpeg`].map(
        u => `${skyPath.value}/${code}${u}`
      )
    )
  }
  return {
    skys,
    index,
    skyPath,
    change,
    load
  }
}
