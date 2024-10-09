import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { getDeviationConfig } from '../utils/model'

import type { ObjectItem } from '../types/model'

export const useText = () => {
  // 创建文字
  const createText = (item: ObjectItem, fontParser, color?) => {
    if (!fontParser) return
    const obj = getDeviationConfig(item, color)
    // 文字
    let textGeo = new TextGeometry(item.name || '', {
      font: fontParser,
      size: obj.size || 5,
      depth: 0,
      curveSegments: 12, // 曲线分段
      bevelThickness: 1, // 斜面厚度
      bevelSize: 0.1, // 斜角大小
      bevelEnabled: true // 斜角
    })
    const rotation = obj.txRot
    textGeo.rotateX(rotation.x)
    textGeo.rotateY(rotation.y)
    textGeo.rotateZ(rotation.z)

    const position = obj.txPos
    // 计算边界
    textGeo.computeBoundingBox()
    // 计算垂直算法
    textGeo.computeVertexNormals()
    let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
    let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)
    let material = new THREE.MeshPhongMaterial({
      color: obj.color != void 0 ? obj.color : 0xffffff,
      flatShading: !true
    })
    let mesh = new THREE.Mesh(textGeo, material)
    mesh.castShadow = true
    mesh.position.set((position.x || 0) - offsetX, position.y || 0, (position.z || 0) - offsetZ)
    mesh.name = 'text'
    return mesh
  }

  return {
    createText
  }
}
