import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import { deepMerge } from '../utils'

export declare interface Options {
  mainTextureUrl: string
  minorTextureUrl: string
}

export declare type Params = import('../types/utils').DeepPartial<Options>

export const useLensflare = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 主光晕
      mainTextureUrl: new URL('three-scene/assets/imgs/texttures/lensflare/lensflare0.png', import.meta.url).href,
      // 次光晕
      minorTextureUrl: new URL('three-scene/assets/imgs/texttures/lensflare/lensflare3.png', import.meta.url).href
    },
    options
  )

  const textureLoader = new THREE.TextureLoader()
  const textureFlare0 = textureLoader.load(_options.mainTextureUrl)
  const textureFlare3 = textureLoader.load(_options.minorTextureUrl)

  const addLensflare = (color, x, y, z) => {
    const light = new THREE.PointLight(0xffffff, 1, 2000, 0)
    light.color.set(color)
    light.position.set(x, y, z)

    const lensflare = new Lensflare()
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color))
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6))
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7))
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9))
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1))

    light.add(lensflare)

    return light
  }

  return {
    addLensflare
  }
}
