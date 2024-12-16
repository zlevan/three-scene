const KEYS = {
  TEXT: 'TEXT', // 文字
  JSQ: 'JSQ', // 集水器
  LDB: 'LDB', // 冷冻泵
  LQB: 'LQB', // 冷却泵
  XBC: 'XBC', // 蓄冰槽
  LXJ: 'LXJ', // 离心机
  LGJ: 'LGJ', // 螺杆机
  LGJ_2: 'LGJ_2', // 双头螺杆机
  LGJ_3: 'LGJ_3', // 三机头螺杆机
  LGJ_4: 'LGJ_4', // 四机头螺杆机
  LQT: 'LQT', // 冷却塔
  GL: 'GL', // 锅炉
  BSHRQ: 'BSHRQ', // 板式换热器
  BSHLQ: 'BSHLQ', // 板式换热器-制冷
  FLRB: 'FLRB', // 风冷热泵
  FJY_X: 'FJY_X', // 风机-右
  FJZ_X: 'FJZ_X', // 风机-左
  FJY: 'FJY', // 风机-右
  FJZ: 'FJZ', // 风机-左
  FM: 'FM', // 阀门
  XFM: 'XFM' // 阀门
}

export default {
  // 本地缓存
  indexdb: {
    dbName: 'THREE__MODEL__DB',
    tbName: 'TB',
    version: 1
  },
  // 网格
  mesh: {
    // 接受阴影网格名称-（需要接受阴影）
    receiveShadowName: [
      '楼板',
      '地面',
      '底座',
      '底板',
      '基础',
      '基础底座',
      '冷却塔基础',
      '草地',
      'ground',
      'Ground'
    ],

    // 动画材质网格名称
    animatehName: [
      '动画',
      '螺杆A',
      '螺杆B',
      '螺杆A001',
      '螺杆B001',
      '螺杆A002',
      '螺杆B002',
      '叶轮A',
      '叶轮B',
      '叶轮C',
      '阀门'
    ],

    // 透明网格名称
    transparentName: ['透明', '透明外壳']
  },

  // 模型类型
  keys: KEYS,
  // 右键点击返回时间差
  rightClickBackDiffTime: 300,

  meshKey: {
    body: Symbol('__BODY_'),
    color: Symbol('__COLOR_'),
    warning: Symbol('__WARNING_'),
    local: Symbol('__LOCAL_'),
    disabled: Symbol('__DISABLED_'),
    pipe: Symbol('__PIPE__')
  },

  // 状态偏差值
  statusOffset: {
    TEXT: {
      [KEYS.JSQ]: {
        position: { x: -20, y: 10, z: 0 },
        rotation: { x: 0, y: 270, z: 0 }
      },
      [KEYS.LDB]: {
        position: { x: -60, y: 0, z: 0 }
      },
      [KEYS.LQB]: {
        position: { x: 0, y: 0, z: 60 },
        rotation: { x: 0, y: 270, z: 0 }
      },
      [KEYS.LXJ]: {
        position: { x: 0, y: 16, z: 50 },
        rotation: { x: -20, y: 0, z: 0 }
      },
      [KEYS.LGJ]: {
        position: { x: 0, y: 16, z: 50 },
        rotation: { x: -20, y: 0, z: 0 }
      },
      [KEYS.LQT]: {
        position: { x: -60, y: 0, z: 0 }
      },
      [KEYS.BSHLQ]: {
        position: { x: 0, y: 16, z: 40 }
      }
    },
    WARNING: {
      [KEYS.JSQ]: {
        position: { x: 0, y: 62, z: 0 }
      },
      [KEYS.LDB]: {
        position: { x: -4, y: 45, z: 0 }
      },
      [KEYS.LQB]: {
        position: { x: 0, y: 45, z: 4 },
        rotation: { x: 0, y: 270, z: 0 }
      },
      [KEYS.LXJ]: {
        position: { x: 0, y: 78, z: 0 }
      },
      [KEYS.LGJ]: {
        position: { x: 0, y: 78, z: 0 }
      },
      [KEYS.LQT]: {
        position: { x: 0, y: 85, z: 0 }
      },
      [KEYS.BSHLQ]: {
        position: { x: 0, y: 88, z: 0 }
      }
    },
    STATUS: {
      [KEYS.LDB]: {
        position: { x: 9, y: 47, z: 0 }
      },
      [KEYS.LQB]: {
        position: { x: 0, y: 47, z: -9 },
        rotation: { x: 0, y: 270, z: 0 }
      },
      [KEYS.LXJ]: {
        position: { x: 27, y: 67, z: 42 }
      },
      [KEYS.LGJ]: {
        position: { x: -47, y: 67, z: 42 }
      },
      [KEYS.LQT]: {
        position: { x: -35, y: 69, z: 26 }
      }
    },
    DISABLED: {
      [KEYS.LDB]: {
        position: { x: 22, y: 47, z: 0 }
      },
      [KEYS.LQB]: {
        position: { x: 0, y: 47, z: -22 },
        rotation: { x: 0, y: 270, z: 0 }
      },
      [KEYS.LXJ]: {
        position: { x: 40, y: 67, z: 42 }
      },
      [KEYS.LGJ]: {
        position: { x: -34, y: 67, z: 42 }
      },
      [KEYS.LQT]: {
        position: { x: -22, y: 69, z: 26 }
      }
    }
  }
}
