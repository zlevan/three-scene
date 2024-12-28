import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import replace from '@rollup/plugin-replace'
import cleanup from 'rollup-plugin-cleanup'


const babelrc = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: '>0.3%, not dead',
        loose: true,
        bugfixes: true
      }
    ]
  ]
}

function babelCleanup() {
  const doubleSpaces = / {2}/g
  return {
    transform(code) {
      code = code.replace(doubleSpaces, '\t')
      return {
        code: code,
        map: null
      }
    }
  }
}

function header() {
  return {
    renderChunk(code) {
      return '\n' + code
    }
  }
}

// 全局变量
const globals = {
  vue: 'Vue'
}

export default {
  input: 'src/main.ts', // 文件入口
  external: ['vue'], // 指定外部依赖

  plugins: [
    vue({
      compileTemplate: true, // 是否将template编译成render函数
      css: true // 提取样式为CSS文件
    }),
    babel({
      exclude: 'node_modules/**' // 不转译node_modules
    }),
    commonjs(), // 将CommonJS模块转换为ES模块

    babelCleanup(),
    header(),
    // resolve(), // 解析导入的第三方模块
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext'
        }
      }
    }),
    cleanup(),
    replace({
      // 正则匹配注释，并将其替换为空字符串
      '/获取贴图地址/g': '',
      '/\*[\s\S]*?\*/': '',
      '/^\s*//.*\n/gm': ''
      // 可以根据需要添加更多的正则匹配规则
    })

  ],

  output: [
    {
      format: 'cjs',
      file: 'build/three-scene.cjs',
      plugins: [terser()], // 压缩UMD版本
      name: 'THREE',
      extend: true
    },
    {
      format: 'esm',
      file: 'build/three-scene.module.js',
      plugins: [terser()], // 压缩UMD版本
      name: 'THREE',
      extend: true
    },
    // {
    //   format: 'esm',
    //   file: 'build/three-scene.module.min.js',
    //   plugins: [terser({

    //     compress: {
    //       // 去除注释
    //       // comments: true,
    //       // 去除无效代码
    //       dead_code: true,
    //       // 默认为 true，去除console、alert等
    //       pure_funcs: ['console.log']
    //     },
    //     mangle: {
    //       // 是否保留变量名
    //       keep_fnames: false
    //     }
    //   })],
    //   name: 'THREE',
    //   extend: true
    // },
    // {
    //   format: 'umd',
    //   file: 'build/three-scene.js',
    //   name: 'THREE',
    //   extend: true
    // },
    // {
    //   format: 'umd',
    //   file: 'build/three-scene.min.js',
    //   plugins: [terser()], // 压缩UMD版本
    //   name: 'THREE',
    //   extend: true
    // }
  ]
}
