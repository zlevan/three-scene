// 判断指定类型
export function isType(type: string, value: any): boolean

// 判断是否为对象
export function isObject(value: any): boolean

// 判断 dom 元素
export function isDOM(obj: any): boolean

/**
 * @description deepClone() 深拷贝-最终版：解决循环引用的问题
 * @param { * } target 对象
 */
export function deepClone(target: object, map?: MapConstructor): object

// 深度合并
export function deepMerge<T, K>(target: T, source: K): T & K
