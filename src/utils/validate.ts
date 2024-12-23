/**
 * 校验url地址是否正确
 * @param { string } url 需要校验的 url 地址
 * @return { boolean } 校验结果
 * @example
 * checkUrl( 'https://www.baidu.com' )
 */
export const checkUrl = (url: string): boolean => {
  !url && (url = '')
  let regex =
    /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/
  if (!regex.test(url)) {
    const reg = /^(https?:\/\/)(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d{1,5})?(?:[/?#]\S*)?$/
    return reg.test(url)
  }
  // return false
  return true
}
