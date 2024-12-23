// 判断指定类型
export const isType = (type: string, value: any): boolean => {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

// 判断是否为对象
export const isObject = (value: any): boolean => {
  return isType('Object', value)
}

// 判断 dom 元素
export const isDOM = (obj: any): boolean => {
  return (
    obj &&
    (typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string')
  )
}

/**
 * @description deepClone() 深拷贝-最终版：解决循环引用的问题
 * @param { * } target 对象
 * @example
 *      const obj1 = {
 *          a: 1,
 *          b: ["e", "f", "g"],
 *          c: { h: { i: 2 } },
 *      };
 *      obj1.b.push(obj1.c);
 *      obj1.c.j = obj1.b;
 *
 *      const obj2 = deepClone(obj1);
 *      obj2.b.push("h");
 *      console.log(obj1, obj2);
 *      console.log(obj2.c === obj1.c);
 */
export const deepClone = (target: any, map = new Map()) => {
  // target 不能为空，并且是一个对象
  if (target != null && isObject(target)) {
    // 在克隆数据前，进行判断是否克隆过,已克隆就返回克隆的值
    let cache = map.get(target)
    if (cache) {
      return cache
    }
    // 判断是否为数组
    const isArray = Array.isArray(target)
    let result: any = isArray ? [] : {}
    // 将新结果存入缓存中
    cache = map.set(target, result)
    // 如果是数组
    if (isArray) {
      // 循环数组，
      target.forEach((item, index) => {
        // 如果item是对象，再次递归
        result[index] = deepClone(item, cache)
      })
    } else {
      // 如果是对象
      Object.keys(target).forEach(key => {
        if (isObject(result[key])) {
          result[key] = deepClone(target[key], cache)
        } else {
          result[key] = target[key]
        }
      })
    }
    return result
  } else {
    return target
  }
}

// 深度合并
export const deepMerge = (target: any, source: any) => {
  target = deepClone(target)
  for (let key in source) {
    if (key in target) {
      // 对象的处理
      if (isObject(source[key])) {
        if (!isObject(target[key])) {
          target[key] = source[key]
        } else {
          target[key] = deepMerge(target[key], source[key])
        }
      } else {
        target[key] = source[key]
      }
    } else {
      target[key] = source[key]
    }
  }
  return target
}
