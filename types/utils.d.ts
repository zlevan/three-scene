// 深度可选
export declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends Object ? DeepPartial<T[P]> : T[P]
}

// 获取对象属性类型
export declare type getType<T, K extends keyof T> = T[K]
