// 深度可选
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends Object
    ? DeepPartial<T[P]>
    : T[P]
}

// 获取对象属性类型
export type getType<T, K extends keyof T> = T[K]
