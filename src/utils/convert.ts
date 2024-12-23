import { checkUrl } from './validate'

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

// 获取地址
export const getUrl = (url: string | string[], baseUrl: string = ''): string | string[] => {
  // 判断数组
  if (Array.isArray(url)) {
    return url.map(u => getUrl(u, baseUrl)) as string[]
  }

  // 检查是否为完整链接 不是则拼接域名地址
  if (!checkUrl(url) && url.indexOf(baseUrl) < 0) {
    return baseUrl + url
  }
  return url
}
