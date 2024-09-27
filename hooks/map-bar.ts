import * as THREE from "three";
import { useCSS3D } from "./css3d";

import { deepMerge } from "../utils";

const { createCSS3DDom } = useCSS3D();

export declare interface Options {
  height: number;
  factor: number;
  size: number;
  color1: string | number;
  color2: string | number;
}

export declare type Params = import("../types/utils").DeepPartial<Options>;

// 地图柱状图
export const useMapBar = (options: Params = {}) => {
  // 默认参数
  let _options: Options = deepMerge(
    {
      // 高度
      height: 10,
      // 柱状大小
      size: 2,
      // 高度系数
      factor: 1,
      color1: 0xfffff,
      color2: 0xffffff,
    },
    options
  );

  const createBar = (
    opts: {
      heightRatio?: number;
      position?: number[];
      label?: {
        name?: string;
        className?: string;
        onClick?: (e: Event) => void;
      };
    } = {},
    options: Params = {}
  ) => {
    _options = deepMerge(_options, options);
    let { size, height, factor, color1, color2 } = _options;
    size *= factor;
    height *= factor;
    height = height * (opts.heightRatio ?? factor);
    const [x, y, z] = opts.position || [0, 0, 0];

    const group = new THREE.Group();

    // 创建柱状图几何体
    const geo = new THREE.BoxGeometry(size, size, height);

    // 自定义着色器材料
    const mat = new THREE.ShaderMaterial({
      depthTest: false,
      // side: THREE.DoubleSide,
      transparent: true,
      vertexColors: false,
      uniforms: {
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uOpacity: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vColor;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        void main() {
          float percent = (position.z + 0.0) / 100.0; // 计算当前像素点在立方体高度上的百分比
          vColor = mix(uColor1.rgb, uColor2.rgb, percent);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;
        void main() {
          gl_FragColor = vec4(vColor, uOpacity);
        }
      `,
    });

    // 创建柱状图网格
    const barMesh = new THREE.Mesh(geo, mat);
    group.add(barMesh);
    group.name = "柱状图";
    group.position.set(x, y, z + height / 2);
    group.renderOrder = 99;

    if (opts.label) {
      const { name = "", className = "", onClick } = opts.label;
      const label = createCSS3DDom({
        name,
        className,
        position: [0, 0, height / 2],
        onClick,
      });
      label.rotateX(Math.PI * 0.5);
      group.add(label);
    }
    return group;
  };

  return {
    createBar,
  };
};
