import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
// import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const babelrc = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: ">0.3%, not dead",
        loose: true,
        bugfixes: true,
      },
    ],
  ],
};

function babelCleanup() {
  const doubleSpaces = / {2}/g;
  return {
    transform(code) {
      code = code.replace(doubleSpaces, "\t");
      return {
        code: code,
        map: null,
      };
    },
  };
}

function header() {
  return {
    renderChunk(code) {
      return "\n" + code;
    },
  };
}

export default [
  {
    input: "src/main.ts",
    plugins: [
      babel({
        babelHelpers: "bundled",
        compact: false,
        babelrc: false,
        ...babelrc,
      }),
      babelCleanup(),
      header(),
      // resolve(), // 解析导入的第三方模块
      commonjs(), // 将CommonJS模块转为ES模块
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext'
          }
        }
      })
    ],
    output: {
      format: "umd",
      file: "build/three-scene.js",
      name: "THREE",
      extend: true,
    },
  },
  {
    input: "src/main.ts",
    plugins: [
      babel({
        babelHelpers: "bundled",
        babelrc: false,
        ...babelrc,
      }),
      babelCleanup(),
      terser(),
      header(),
      // resolve(), // 解析导入的第三方模块
      commonjs(), // 将CommonJS模块转为ES模块
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext'
          }
        }
      })
    ],
    output: {
      format: "umd",
      file: "build/three-scene.min.js",
      name: "THREE",
      extend: true,
    },
  },
  {
    input: "src/main.ts",
    plugins: [
      header(),
      // resolve(), // 解析导入的第三方模块
      commonjs(), // 将CommonJS模块转为ES模块
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext'
          }
        }
      })
    ],
    output: {
      format: "esm",
      file: "build/three-scene.module.js",
    },
  },
];
