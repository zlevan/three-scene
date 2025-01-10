/**
 * 换算单位(汉字单位-四舍五入)
 * @param { number } num 需转换汉字的数值
 * @param { number } precision 数值精度  默认：2
 * @return { number | string } 换算后的值
 * @example
 * numConverter( 1111555 )
 */
export function numConverter(num: number, precision?: number): number | string

// 获取地址
export function getUrl(
  url: string | string[],
  baseUrl: string
): string | string[]
