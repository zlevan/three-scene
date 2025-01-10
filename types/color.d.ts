export type Color = number | string | (number | string)[]

// data
export interface ColorObject {
  // 默认颜色
  color: Color
  // 主体颜色
  main: Color
  // 文字颜色
  text?: Color
  // 其他
  [key: string]: Color
}

export interface Colors {
  // 正常
  normal: ColorObject
  // 运行
  runing: ColorObject
  // 故障
  error: ColorObject
}
