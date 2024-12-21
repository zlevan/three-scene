// 获取贴图地址
export const getTextturesUrl = (jpg: string): string => {
  return new URL(`../assets/imgs/texttures/${jpg}`, import.meta.url).href
}
