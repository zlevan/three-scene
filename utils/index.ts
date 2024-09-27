// 判断指定类型
export const isType = (type: string, value): boolean => {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

// 判断是否为对象
export const isObject = (value): boolean => {
  return isType('Object', value)
}

// 判断 dom 元素
export const isDOM = (obj): boolean => {
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
export const deepClone = (target, map = new Map()) => {
  // target 不能为空，并且是一个对象
  if (target != null && isObject(target)) {
    // 在克隆数据前，进行判断是否克隆过,已克隆就返回克隆的值
    let cache = map.get(target)
    if (cache) {
      return cache
    }
    // 判断是否为数组
    const isArray = Array.isArray(target)
    let result = isArray ? [] : {}
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
export const deepMerge = (target, source) => {
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

// 随机数
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 校验url地址是否正确
 * @param { string } url 需要校验的 url 地址
 * @return { boolean } 校验结果
 * @example
 * checkUrl( 'https://www.baidu.com' )
 */
export const checkUrl = (url: string): boolean => {
  !url && (url = '')
  let regex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/
  if (!regex.test(url)) return false
  return true
}

// 获取地址
export const getUrl = (url: string | string[], baseUrl: string = '') => {
  // 判断数组
  if (Array.isArray(url)) {
    return url.map(u => getUrl(u, baseUrl))
  }
  // 检查是否为完整链接 不是则拼接域名地址
  if (!checkUrl(url) && url.indexOf(baseUrl) < 0) {
    return baseUrl + url
  }
  return url
}

/**
 * 换算单位(汉字单位-四舍五入)
 * @param { number } num 需转换汉字的数值
 * @param { number } precision 数值精度  默认：2
 * @return { number | string } 换算后的值
 * @example
 * numConverter( 1111555 )
 */
export const numConverter = (num: number = 0, precision: number = 2) => {
  if (Math.abs(num) >= 100000000) {
    const n: any = num / 100000000
    return n.toFixed(precision) * 1 + '亿'
  } else if (Math.abs(num) >= 10000) {
    const n: any = num / 10000
    return n.toFixed(precision) * 1 + '万'
  } else {
    const n: any = num
    return n.toFixed(precision) * 1
  }
}
