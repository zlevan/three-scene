// 随机数
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}