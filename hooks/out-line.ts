import * as THREE from "three";
import { deepMerge } from "../utils";

export declare interface Options {
  size: number;
  color: string | number;
  range: number;
  factor: number;
  speed: number;
}

export declare type Params = import("../types/utils").DeepPartial<Options>;

export const useOutline = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 粒子大小
      size: 0.1,
      color: 0xf57170,
      // 动画范围
      range: 500,
      // 系数
      factor: 1,
      // 速度
      speed: 6,
    },
    options
  );
  const createOutline = (
    points: number[],
    options: Params = {}
  ): InstanceType<typeof THREE.Points> => {
    _options = deepMerge(_options, options);
    const { size, factor, range, color } = _options;
    const positions = new Float32Array(points);
    const opacityGeometry = new THREE.BufferGeometry();
    // 设置顶点
    opacityGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    // 设置索引
    const vertexIndexs = new Float32Array(Math.floor(positions.length / 3)).map(
      (_, i) => i
    );
    opacityGeometry.setAttribute(
      "aIndex",
      new THREE.BufferAttribute(vertexIndexs, 1)
    );

    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aOpacity;
        uniform float uSize;

        attribute float aIndex;
        varying vec3 vp;
        varying float vertexIndex;

        void main(){
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
          gl_PointSize = uSize;

          vp = position;
          vertexIndex = aIndex;
        }
      `,
      fragmentShader: `
        varying float vertexIndex;
        uniform vec3 uColor;
        uniform float uIndex;
        uniform float uRange;

        float invert(float n){
          return 1.-n;
        }

        void main(){
          float uOpacity = 1.0;
          if(vertexIndex <= uIndex || vertexIndex >= (uRange + uIndex)){
              discard;
          }
          uOpacity = (vertexIndex - uIndex)/uRange;
          if ( uOpacity < 0.2) {
            discard;
          }
          vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
          vec2 cUv=2.*uv-1.;
          vec4 color=vec4(1./length(cUv));
          color*=uOpacity;
          color.rgb*=uColor;
          gl_FragColor=color;
        }
      `,
      transparent: true, // 设置透明
      depthTest: false,
      uniforms: {
        uSize: {
          value: size * factor,
        },
        uIndex: { value: 0 },
        uLength: { value: vertexIndexs.length },
        uRange: { value: range },
        uColor: {
          value: new THREE.Color(color),
        },
      },
    });
    const opacityPoints = new THREE.Points(opacityGeometry, mat);
    opacityPoints.name = "轮廓";
    opacityPoints.scale.setScalar(factor);
    return opacityPoints;
  };

  const update = (mesh) => {
    const mat = mesh.material;
    const uLength = mat.uniforms.uLength.value;
    mat.uniforms.uIndex.value += _options.speed;
    if (mat.uniforms.uIndex.value >= uLength) {
      mat.uniforms.uIndex.value = 0;
    }
  };

  return {
    createOutline,
    update,
    outlineUpdate: update,
  };
};
