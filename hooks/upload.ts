import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'
import { deepMerge } from '../utils'

import type { Options } from '../types/upload'

type Params = import('../types/utils').DeepPartial<Options>

// 上传 upload
export const useUpload = (options: Params) => {
  const _options: Options = deepMerge(
    {
      // 资源地址
      baseUrl: '',
      // draco 解压文件目录
      dracoPath: '/three/draco/gltf/',
      // basis 解压文件目录
      basisPath: '/three/basis/'
    },
    options
  )

  const uploadModel = (files, onSuccess: Function, onProgress?: Function) => {
    const { baseUrl, dracoPath, basisPath } = _options
    const file = files[0]
    console.log(file)
    const filename = file.name
    const type = filename.split('.').pop().toLowerCase()

    const reader = new FileReader()
    reader.addEventListener('progress', event => {
      const size = '(' + Math.floor(event.total / 1000) + ' KB)'
      const progress = Math.floor((event.loaded / event.total) * 100) + '%'
      console.log('Loading', filename, size, progress)
      if (onProgress) onProgress({ progress })
    })

    reader.addEventListener('load', async (event: any) => {
      const contents = event.target.result

      if (['glb', 'gltf'].includes(type)) {
        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader()

        dracoLoader.setDecoderPath(`${baseUrl}${dracoPath}`)
        loader.setDRACOLoader(dracoLoader)

        const ktx2Loader = new KTX2Loader()
        ktx2Loader.setTranscoderPath(`${baseUrl}${basisPath}`)
        loader.setKTX2Loader(ktx2Loader)

        loader.setMeshoptDecoder(MeshoptDecoder)

        loader.parse(contents, '', result => {
          const children = result.scene.children
          let object = new THREE.Group()
          if (children.length > 1) {
            object.add(...children)
          } else {
            object = children[children.length - 1]
          }
          object.name = object.userData?.name || filename
          object.animations.push(...result.animations)
          onSuccess(object)
          loader.dracoLoader.dispose()
          loader.ktx2Loader.dispose()
        })
      } else if (type == 'fbx') {
        const loader = new FBXLoader()
        const object = loader.parse(contents)
        console.log(type, ' 模型', object)
        onSuccess(object)
      }
    })
    reader.readAsArrayBuffer(file)
  }

  return {
    uploadModel
  }
}
