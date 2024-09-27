import * as THREE from 'three'
import { deepMerge } from '../utils'

export declare interface Options {
  depth: number
  height: number
  divisions: number
  coords: number[][]
  color: string | number
  flyColor: string | number
  pointColor: string | number
  pointWidth: number
  tubularSegments: number
  radius: number
  flyPointWidth: number
  radialSegments: number
  closed: boolean
  length: number
  factor: number
  speed: number
}

export declare type Params = import('../types/utils').DeepPartial<Options>

// 飞线
export const useFlywire = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 深度
      depth: 0,
      // 高度(凸起高度)
      height: 4,
      // 飞线点位数
      divisions: 1000,
      color: 0xffffff,
      // 飞线-动态
      flyColor: 0xffc107,
      // 点位
      pointColor: 0xff0ff0,
      pointWidth: 2.5,
      // 流动飞线点位宽度
      flyPointWidth: 2.4,
      // 管道分段数 默认值为64。
      tubularSegments: 256,
      // 管道的半径，默认值为1。
      radius: 0.5,
      // 管道横截面的分段数目，默认值为8
      radialSegments: 8,
      // 管道的两端是否闭合，默认值为false。
      closed: false,
      // 流动长度
      length: 100,
      // 系数
      factor: 1,
      // 流动速度
      speed: 4
    },
    options
  )

  // 流动材质
  let flyMaterial: InstanceType<typeof THREE.ShaderMaterial>

  // 做标点材质
  let pointMaterial: InstanceType<typeof THREE.ShaderMaterial>

  // 根据起点和终点获取曲线做标点
  const getCurvePoint = (coords: import('../types/utils').getType<Options, 'coords'>) => {
    const [x1, z1] = coords[0]
    const [x2, z2] = coords[1]
    let { depth, height, factor, divisions } = _options
    height = (depth + height) * factor
    depth *= factor

    // 坐标起点
    const v0 = new THREE.Vector3(x1, depth, -z1)
    // 控制点1坐标
    // 起点基础上，增加区间范围的 1/4
    const v1 = new THREE.Vector3(x1 + (x2 - x1) / 4, height, -(z1 + (z2 - z1) / 4))

    // 控制点2坐标
    // 起点基础上，增加区间范围的 3/4
    const v2 = new THREE.Vector3(x1 + ((x2 - x1) * 3) / 4, height, -(z1 + ((z2 - z1) * 3) / 4))

    // 终点
    const v3 = new THREE.Vector3(x2, depth, -z2)
    // 使用3次贝塞尔曲线
    const lineCurve = new THREE.CubicBezierCurve3(v0, v1, v2, v3)
    // 获取曲线上的点
    return lineCurve.getPoints(divisions)
  }

  // 创建飞线-动态
  const createFly = points => {
    const indexList = new Float32Array(points.map((_, index) => index))
    // 根据点位创建几何体
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    // 设置自定义索引标识
    geo.setAttribute('aIndex', new THREE.BufferAttribute(indexList, 1))

    return new THREE.Points(geo, flyMaterial)
  }

  // 创建坐标点
  const createCroodPoint = crood => {
    const [x, z] = crood
    let { pointWidth, depth, factor } = _options
    const width = pointWidth * factor
    depth *= factor

    // 创建平面
    const geo = new THREE.PlaneGeometry(width, width, 1, 1)
    const point = new THREE.Mesh(geo, pointMaterial)
    point.position.set(x, depth, -z)
    point.rotateX(-Math.PI * 0.5)
    return point
  }

  // 创建材质
  const createFlywireTexture = (options: Params = {}) => {
    _options = deepMerge(_options, options)

    flyMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      uniforms: {
        // 线条颜色
        uColor: { value: new THREE.Color(_options.flyColor) },
        uIndex: { value: 0 },
        uTotal: { value: _options.divisions },
        // 流动宽度
        uWidth: { value: _options.flyPointWidth },
        // 流动长度
        uLength: { value: _options.length }
      },
      vertexShader: `
        attribute float aIndex;
        uniform float uIndex;
        uniform float uWidth;
        uniform vec3 uColor;
        varying float vSize;
        uniform float uLength;
  
        void main(){
            vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
            gl_Position = projectionMatrix * viewPosition;
  
            if(aIndex >= uIndex - uLength && aIndex < uIndex){
              vSize = uWidth * ((aIndex - uIndex + uLength) / uLength);
            }
            gl_PointSize = vSize;
        }
      `,
      side: THREE.DoubleSide,
      fragmentShader: `
        varying float vSize;
        uniform vec3 uColor;
        void main(){
            if(vSize<=0.0){
              gl_FragColor = vec4(1,0,0,0);
            }else{
              gl_FragColor = vec4(uColor,1);
            }
        }
      `,
      transparent: true,
      vertexColors: false
    })

    pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(_options.pointColor) },
        uOpacity: { value: 1 }, // 透明度
        uSpeed: { value: 0.1 }, // 速度
        uSge: { value: 4 }, // 数量（圈数）
        uRadius: { value: (_options.pointWidth * _options.factor) / 2 },
        time: { value: 0.0 }
      },
      transparent: true,
      depthTest: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          // 最终顶点位置信息=投影矩阵*模型视图矩阵*每个顶点坐标
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uSpeed;
        uniform float uSge;
        uniform float time;
        float PI = 3.14159265;
        float drawCircle(float index, float range) {
          float opacity = 1.0;
          if (index >= 1.0 - range) {
            opacity = 1.0 - (index - (1.0 - range)) / range;
          } else if(index <= range) {
            opacity = index / range;
          }
          return opacity;
        }
        float distanceTo(vec2 src, vec2 dst) {
          float dx = src.x - dst.x;
          float dy = src.y - dst.y;
          float dv = dx * dx + dy * dy;
          return sqrt(dv);
        }
        void main() {
          float iTime = -time * uSpeed;
          float opacity = 0.0;
          float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));
  
          float size = 1.0 / uSge;
          vec2 range = vec2(0.65, 0.75);
          float index = mod(iTime + len, size);
          // 中心圆
          vec2 cRadius = vec2(0.06, 0.12);
  
          if (index < size && len <= 0.5) {
            float i = sin(index / size * PI);
  
            // 处理边缘锯齿
            if (i >= range.x && i <= range.y){
              // 归一
              float t = (i - range.x) / (range.y - range.x);
              // 边缘锯齿范围
              float r = 0.3;
              opacity = drawCircle(t, r);
            }
            // 渐变
            opacity *=  1.0 - len / 0.5;
          };
          gl_FragColor = vec4(uColor, uOpacity * opacity);
        }
      `,
      side: THREE.DoubleSide
    })
  }

  const createFlywire = (coords: import('../types/utils').getType<Options, 'coords'>) => {
    const group = new THREE.Group()

    // 坐标
    const start = createCroodPoint(coords[0])
    const end = createCroodPoint(coords[1])
    group.add(start, end)

    const points = getCurvePoint(coords)
    // 平滑样条线
    // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
    // 曲线类型：centripetal、chordal和catmullrom
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
    // 管道
    const tubeGeo = new THREE.TubeGeometry(
      // 3D 路径
      curve,
      // 管道分段数
      _options.tubularSegments,
      // 半径
      _options.radius,
      // 横截面分段
      _options.radialSegments,
      // 管道闭合
      _options.closed
    )
    const tubMat = new THREE.ShaderMaterial({
      transparent: true,
      opacity: 1,
      depthTest: false,
      vertexColors: false,
      uniforms: {
        uColor: { value: new THREE.Color(_options.color) },
        uOpacity: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vColor;
        uniform vec3 uColor;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        void main() {
          gl_FragColor = vec4(uColor, uOpacity);
        }
      `
    })
    const tubMesh = new THREE.Mesh(tubeGeo, tubMat)
    tubMesh.renderOrder = 10

    // 飞线
    const fly = createFly(points)
    group.add(tubMesh, fly)
    return group
  }
  const update = () => {
    const mat = flyMaterial
    const uTotal = mat.uniforms.uTotal.value
    mat.uniforms.uIndex.value += _options.speed
    if (mat.uniforms.uIndex.value >= uTotal) {
      mat.uniforms.uIndex.value = 0
    }

    const time = performance.now() * 0.001
    pointMaterial.uniforms.time.value = time
  }
  createFlywireTexture()
  return {
    createFlywireTexture,
    createFlywire,
    update,
    flywireUpdate: update
  }
}
