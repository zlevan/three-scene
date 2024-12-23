import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import type { Options } from '../../types/corrugated-plate'
import { deepMerge } from '../../utils'

type Params = import('../../types/utils').DeepPartial<Options>

export const useCorrugatedPlate = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 范围
      range: 100,
      // 间隔
      interval: 0.8,
      // 单个平面大小
      size: 0.2,
      // 颜色
      color: 0x00b8a9,
      // 浅色
      light: 0x0d7377,
      // 系数
      factor: 1
    },
    options
  )

  const createGeometry = () => {
    let { range, interval, size, factor } = _options
    range *= factor
    interval *= factor
    size *= factor
    const geometrys: InstanceType<typeof THREE.PlaneGeometry>[] = []
    // 间隔，大小
    const len = Math.floor(range / interval)

    // 阵列多个立方体网格模型
    for (let i = -len; i <= len; i++) {
      for (let j = -len; j <= len; j++) {
        const geo = new THREE.PlaneGeometry(size, size)
        const x = i * interval
        const z = j * interval
        // 矩阵
        const matrix = new THREE.Matrix4()
        const pos = new THREE.Vector3(x, -size, z)
        // 四元数
        const quaternion = new THREE.Quaternion()
        // 欧拉对象
        const rotation = new THREE.Euler()
        // 缩放
        const scale = new THREE.Vector3(1, 1, 1)

        quaternion.setFromEuler(rotation)
        // 传入位置，角度，缩放 构建矩阵
        matrix.compose(pos, quaternion, scale)
        // 应用缩放矩阵到geometry的每个顶点
        geo.applyMatrix4(matrix)
        geometrys.push(geo)
      }
    }
    return geometrys
  }

  const createCorrugatedPlate = (options: Params = {}) => {
    _options = deepMerge(_options, options)
    let { range, color, light, factor } = _options
    range *= factor
    const geometrys = createGeometry()
    // 合并几何图形
    const geometry = BufferGeometryUtils.mergeGeometries(geometrys)
    const material = new THREE.ShaderMaterial({
      //  着色器代码 变量
      uniforms: {
        uColor: { value: new THREE.Color(light) },
        uTcolor: { value: new THREE.Color(color) },
        uRadius: { value: 1.25 },
        uLength: { value: range / 10 }, // 扫过区域(宽度)
        uRange: { value: range } // 扫过最大范围
      },
      // 顶点着色器
      vertexShader: `
        varying vec3 vp;
        void main(){
          vp = position;
          gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // 片元着色器
      fragmentShader: `
        varying vec3 vp;
        uniform vec3 uColor;
        uniform vec3 uTcolor;
        uniform float uRadius;
        uniform float uLength;
        float getLeng(float x, float y){
          return  sqrt((x-0.0)*(x-0.0)+(y-0.0)*(y-0.0));
        }
        void main(){
          float uOpacity = 0.8;
          vec3 vColor = uColor;
          float length = getLeng(vp.x,vp.z);
          if ( length <= uRadius && length > uRadius - uLength ) {
            float op = sin( (uRadius - length) / uLength ) ;
            uOpacity = op;
            if ( vp.y < 0.0 ) {
              vColor = uColor * op;
            } else {
              vColor = uTcolor;
            };
            vColor = uTcolor;
          }
          gl_FragColor = vec4(vColor,uOpacity);
        }
      `,
      transparent: true,
      // 深度写入
      depthWrite: false,
      // depthTest: false,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = '波纹板'
    return mesh
  }

  const update = (mesh: InstanceType<typeof THREE.Mesh>, dalte: number) => {
    const mat: any = mesh.material
    // 扩散波半径
    const range = mat.uniforms.uRange.value
    const length = mat.uniforms.uLength.value
    mat.uniforms.uRadius.value += dalte * (range / 4)
    if (mat.uniforms.uRadius.value >= range + length) {
      mat.uniforms.uRadius.value = 0
    }
  }

  return {
    createCorrugatedPlate,
    update,
    corrugatedPlateUpdate: update
  }
}
