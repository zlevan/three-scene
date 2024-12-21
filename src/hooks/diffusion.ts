import * as THREE from 'three'

// 扩散波 diffusion
export const useDiffusion = () => {
  let material: InstanceType<typeof THREE.ShaderMaterial>

  const createDiffusion = (width = 10, color: number | string = 0xff0ff0, circle = 5) => {
    const geometry = new THREE.PlaneGeometry(width, width, 1, 1)
    const vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      // 最终顶点位置信息=投影矩阵*模型视图矩阵*每个顶点坐标
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('')

    const fragmentShader = [
      'varying vec2 vUv;',
      'uniform vec3 uColor;',
      'uniform float uOpacity;',
      'uniform float uSpeed;',
      'uniform float uSge;',
      'uniform float time;',
      'float PI = 3.14159265;',
      'float drawCircle(float index, float range) {',
      '  float opacity = 1.0;',
      '  if (index >= 1.0 - range) {',
      '    opacity = 1.0 - (index - (1.0 - range)) / range;',
      '  } else if(index <= range) {',
      '    opacity = index / range;',
      '  }',
      '  return opacity;',
      '}',
      'float distanceTo(vec2 src, vec2 dst) {',
      '  float dx = src.x - dst.x;',
      '  float dy = src.y - dst.y;',
      '  float dv = dx * dx + dy * dy;',
      '  return sqrt(dv);',
      '}',
      'void main() {',
      '  float iTime = -time * uSpeed;',
      '  float opacity = 0.0;',
      '  float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));',
      '  float size = 1.0 / uSge;',
      '  vec2 range = vec2(0.65, 0.75);',
      '  float index = mod(iTime + len, size);',
      // 中心圆
      '  vec2 cRadius = vec2(0.06, 0.12);',
      '  if (index < size && len <= 0.5) {',
      '    float i = sin(index / size * PI);',
      // 处理边缘锯齿
      '    if (i >= range.x && i <= range.y){',
      // 归一
      '      float t = (i - range.x) / (range.y - range.x);',
      // 边缘锯齿范围
      '      float r = 0.3;',
      '      opacity = drawCircle(t, r);',
      '    }',
      // 渐变
      '    opacity *=  1.0 - len / 0.5;',
      '  };',
      '  gl_FragColor = vec4(uColor, uOpacity * opacity);',
      '}'
    ].join('')
    material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: 1 }, // 透明度
        uSpeed: { value: 0.1 }, // 速度
        uSge: { value: circle }, // 数量（圈数）
        uRadius: { value: width / 2 },
        time: { value: 0.0 }
      },
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  const updateDiffusion = (factor = 1) => {
    if (!material) return
    const time = performance.now() * 0.001 * factor
    material.uniforms.time.value = time
  }

  return {
    createDiffusion,
    updateDiffusion
  }
}
