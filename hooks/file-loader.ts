import { ref } from 'vue'
import * as THREE from 'three'

// 加载文件
export const useFileLoader = () => {
  // 进度
  const progress = ref(0)

  // 加载
  const load = url => {
    const loader = new THREE.FileLoader()
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        data => {
          let json = {}
          try {
            json = JSON.parse(data)
          } catch (er) {}
          resolve(json)
        },
        xhr => {
          let { loaded, total } = xhr
          progress.value = Number(((loaded / total) * 100).toFixed(0))
        },
        reject
      )
    })
  }

  return {
    load,
    progress
  }
}
