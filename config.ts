export default {
  // 本地缓存
  indexdb: {
    dbName: 'THREE__MODEL__DB',
    tbName: 'TB',
    version: 1
  },
  // 网格
  mesh: {
    receiveShadowName: ['地面', '底座', '底板', '基础', '基础底座', '冷却塔基础']
  },
  // 模型类型
  keys: {
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
  },
  // 右键点击返回时间差
  rightClickBackDiffTime: 100,

  meshKey: {
    body: Symbol('__BODY_'),
    warning: Symbol('__WARNING_'),
    local: Symbol('__LOCAL_'),
    disabled: Symbol('__DISABLED_')
  }
}
