import type { Colors } from '../../types/color'

// 颜色
const color = {
  normal: 0x88a1b5,
  runing: 0x2e77f8,
  error: 0xc20c00
}

export const colors: Colors = {
  // 正常
  normal: {
    color: color.normal,
    main: [0x88a1b5, 0x292e31],
    text: 0xb9dbff,
    FM: 0x606c74
  },
  // 运行
  runing: {
    color: color.runing,
    main: 0x2e77f8,
    FM: 0x067417
  },
  // 故障
  error: {
    color: color.error,
    main: 0xb54425,
    FM: 0xe82d1b
  }
}
