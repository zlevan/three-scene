import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import { deepMerge } from '../../utils'
import { getTextturesUrl } from '../../utils/asssets'

import type { Options } from '../../types/lensflare'

type Params = import('../../types/utils').DeepPartial<Options>

// 太阳光晕 lensflare
export const useLensflare = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 主光晕
      mainTextureUrl: getTextturesUrl('lensflare0.png'),
      // 次光晕
      minorTextureUrl: getTextturesUrl('lensflare3.png')
    },
    options
  )
  console.log(_options)

  const textureLoader = new THREE.TextureLoader()
  const textureFlare0 = textureLoader.load(_options.mainTextureUrl)
  const textureFlare3 = textureLoader.load(_options.minorTextureUrl)

  const addLensflare = (color: string | number, x: number, y: number, z: number) => {
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
