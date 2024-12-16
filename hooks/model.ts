import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import DefaultConfig from '../config'

import type { ReplaceOpts } from '../types/model'

// 模型 model
export const useModel = () => {
  // 改变透明
  const changeTransparent = (mode, opacity = 0.5) => {
    // 改变透明度
    const change = mesh => {
      mesh.material.transparent = true
      mesh.material.opacity = opacity
    }
    if (mode.isMesh) {
      change(mode)
    } else {
      mode.traverse(mode => {
        if (mode.isMesh) {
          change(mode)
        }
      })
    }
  }

  const getMaterialAttr = mat => {
    return {
      color: mat.color, // 颜色
      map: mat.map, // 贴图
      emissive: mat.emissive, // 发光
      emissiveIntensity: mat.emissiveIntensity,
      emissiveMap: mat.emissiveMap,
      bumpMap: mat.bumpMap, // 凹凸
      normalMap: mat.normalMap, // 法线
      displacementMap: mat.displacementMap, // 移动
      opacity: mat.opacity, // 透明度
      transparent: mat.transparent, // 透明
      side: mat.side // 材质渲染面
    }
  }

  // 材质优化 材质、是否反光、是否粗糙
  const materialOptimize = (mat: any, glisten?: boolean, side?: boolean) => {
    if (mat instanceof Array) {
      let material = mat.map(mt => {
        return materialOptimize(mt, glisten, side)
      })
      mat = material
    } else {
      if (!glisten) {
        // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        mat.metalness = 0.5
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        mat.roughness = 1
      } else {
        // mat.side = THREE.DoubleSide
        mat.metalness = 0.5
        mat.roughness = 0
      }
      // child.material.emissiveMap = child.material.map
      mat = new THREE.MeshStandardMaterial({
        ...getMaterialAttr(mat),
        // depthTest: false, // 深度写入（解决重叠）
        metalness: mat.metalness, // 金属度
        roughness: mat.roughness, // 粗糙度
        side: side ? THREE.DoubleSide : THREE.FrontSide // 材质渲染面
      })
    }
    return mat
  }

  // 材质替换  动画部分材质颜色
  const materialReplace = (group: any, opts: ReplaceOpts, child, color = 0x127e12) => {
    const mesh = DefaultConfig.mesh
    const animateMeshName = mesh.animatehName
    const transparentMeshName = mesh.transparentName
    const { type, name } = child
    // 灯光
    if (type.indexOf('Light') > -1) {
      if (!child.shadow) return
      let s = 800
      child.castShadow = true
      child.shadow.camera.right = s
      child.shadow.camera.left = -s
      child.shadow.camera.top = s
      child.shadow.camera.bottom = -s

      if (type === 'SpotLight') {
        let helper = new THREE.SpotLightHelper(child, 1, child.color)
        group.add(helper)
      }
      return
    }
    if (!opts.transformMaterial || !child.isMesh) return

    if (opts.opacitySkin && transparentMeshName.find(it => name.indexOf(it) > -1)) {
      changeTransparent(child, opts.opacity)
    }

    if (mesh.receiveShadowName.find(it => name.indexOf(it) > -1)) {
      // 接收阴影
      child.receiveShadow = true
      const glisten = opts.groundReflection
      child.material = materialOptimize(child.material, glisten, opts.side)
    } else if (animateMeshName.find(it => name.indexOf(it) > -1)) {
      // 动画材质
      let material = new THREE.MeshStandardMaterial({
        color: color,
        // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
        // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
        metalness: 0.6,
        // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
        roughness: 0.6
      })
      child.material = material
    } else if (child.isMesh) {
      child.castShadow = true

      child.material = materialOptimize(child.material, opts.glisten, opts.side)
    }
  }

  const saveFile = (blob, filename) => {
    const link = document.createElement('a')
    link.style.display = 'none'
    document.body.appendChild(link) // Firefox workaround, see #6594

    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    link.remove()
  }

  const saveString = (text, filename) => {
    saveFile(new Blob([text], { type: 'text/plain' }), filename)
  }

  const saveArrayBuffer = (buffer, filename) => {
    console.log(buffer)
    saveFile(new Blob([buffer], { type: 'application/octet-stream' }), filename)
  }

  // 导出 glb、gltf 文件
  const exportGlb = (model, animations, name, isGlb: boolean = true) => {
    if (!model) return
    const gltfExporter = new GLTFExporter()
    const options = {
      // trs: false,
      // onlyVisible: true,
      // truncateDrawRange: true,
      binary: isGlb,
      // maxTextureSize: 1024 || 4096 || Infinity, // To prevent NaN value,
      animations: animations // 动画
    }
    console.log(model)
    gltfExporter.parse(
      model,
      result => {
        console.log(result)
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, name + '.glb')
        } else {
          const output = JSON.stringify(result, null, 2)
          console.log({ output })
          saveString(output, name + '.gltf')
        }
      },
      error => {
        console.log('An error happened during parsing', error)
      },
      options
    )
  }

  // 获取动画
  const getAnimations = model => {
    const animations: any[] = []

    model.traverse(object => {
      animations.push(...object.animations)
    })

    const optimizedAnimations: any[] = []

    for (const animation of animations) {
      optimizedAnimations.push(animation.clone().optimize())
    }

    return optimizedAnimations
  }

  // 设置金属材质
  const setMetalnessMaterial = (mat = { color: 0xffffff }, metalness, roughness) => {
    return new THREE.MeshStandardMaterial({
      ...getMaterialAttr(mat),
      metalness: metalness, // 金属度
      roughness: roughness // 粗糙度
    })
  }
  // 设置玻璃材质
  const setGlassMaterial = (
    mat = {
      color: 0xffffff
    },
    { metalness, roughness, envMapIntensity, transmission, ior }
  ) => {
    return new THREE.MeshPhysicalMaterial({
      ...getMaterialAttr(mat),
      metalness, //玻璃非金属  金属度设置0
      roughness, //玻璃表面光滑
      envMapIntensity, //环境贴图对Mesh表面影响程度
      transmission, //透射度(透光率)
      ior //折射率
    })
  }

  // 盒子模型辅助
  const centerBoxHelper = (model: any, hex = 0xff0000) => {
    // 创建 BoxHelper
    var boxHelper = new THREE.BoxHelper(model, hex)
    //更新
    boxHelper.update()
    // 获取模型的包围盒
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    return {
      helper: boxHelper,
      center
    }
  }

  return {
    materialReplace,
    changeTransparent,
    exportGlb,
    getAnimations,
    setMetalnessMaterial,
    setGlassMaterial,
    centerBoxHelper
  }
}
