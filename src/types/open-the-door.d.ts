export interface Options {
  propertyName: string
  value: string
  scale: number
  angle: number
  axle: 'x' | 'y' | 'z'
  isOpen?: boolean
  leftMatch: string
  rightMatch: string
  duration: number
  autoClose: boolean
  delay: number
}
