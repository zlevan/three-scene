import * as THREE from 'three'

import { fenceMap0, fenceMap1, fenceMap2 } from '../../assets/base/fence'

// 电子围栏 fence
export const useFence = () => {
  const repeat = [1, 0.8]
  const offsetY = 0.2
  // 贴图
  const texture = new THREE.TextureLoader().load(fenceMap0, tx => {
    tx.wrapT = THREE.RepeatWrapping
    tx.repeat.x = repeat[0]
    tx.repeat.y = repeat[1]
    tx.offset.y = offsetY
  })
  const texture2 = new THREE.TextureLoader().load(fenceMap1, tx => {
    tx.wrapT = THREE.RepeatWrapping
    tx.repeat.x = repeat[0]
    tx.repeat.y = repeat[1]
    tx.offset.x = offsetY
  })
  const texture3 = new THREE.TextureLoader().load(fenceMap2, tx => {
    tx.wrapS = THREE.RepeatWrapping
    tx.wrapT = THREE.RepeatWrapping
  })

  // 创建平面
  const createPlane = (arr: any[], indexArr: number[], color: number | string) => {
    // 获取定点坐标组成一维数组
    const data: any[] = []
    for (let i = 0; i < indexArr.length; i++) {
      const index = indexArr[i]
      data.push(...arr[index])
    }
    const geometry = new THREE.BufferGeometry()

    // 设置几何图形顶点位置 3 个一组
    const vertices = new Float32Array(data)
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

    const count = indexArr.length
    const normalAttribute = new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    geometry.setAttribute('normal', normalAttribute)
    for (let i = 0; i < count; i++) {
      normalAttribute.setXYZ(i, 0, 0, 0)
    }

    const uvs = [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1]
    const uvsAttribute = new THREE.BufferAttribute(new Float32Array(uvs), 2)
    geometry.setAttribute('uv', uvsAttribute)

    const material = new THREE.MeshPhongMaterial({
      color: color,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    const material2 = new THREE.MeshPhongMaterial({
      color: color,
      map: texture2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })

    var material3 = new THREE.MeshPhongMaterial({
      color: color,
      map: texture3,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geometry, material)
    const group = new THREE.Group()
    const mesh2 = new THREE.Mesh(geometry, material2)
    const mesh3 = new THREE.Mesh(geometry, material3)
    group.add(mesh, mesh2, mesh3)
    // group.add(mesh2, mesh3)
    return group
  }

  const createFence = (
    model: InstanceType<typeof THREE.Object3D>,
    color: number | string = 0xa7ff83
  ) => {
    const group = new THREE.Group()

    var boxHelper = new THREE.BoxHelper(model, color)
    boxHelper.update()
    const pos = boxHelper.geometry.getAttribute('position').array

    const arr: any[] = []
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i]
      const y = pos[i + 1]
      const z = pos[i + 2]
      arr.push([x, y, z])
    }

    // 围栏
    const m1 = createPlane(arr, [0, 1, 2, 2, 3, 0], color)
    const m2 = createPlane(arr, [4, 5, 6, 6, 7, 4], color)
    const m3 = createPlane(arr, [4, 0, 3, 3, 7, 4], color)
    const m4 = createPlane(arr, [1, 5, 6, 6, 2, 1], color)
    group.add(m1, m2, m3, m4)

    return group
  }

  const fenceAnimate = (factor = 1) => {
    const steep = 0.008 * factor
    if (texture) {
      let y = texture.offset.y - steep
      if (y < 0) y = offsetY
      texture.offset.y = y
    }
    if (texture2) {
      let y = texture2.offset.y - steep
      if (y < 0) y = offsetY
      texture2.offset.y = y
    }
  }

  return {
    createFence,
    fenceAnimate
  }
}
