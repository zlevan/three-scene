export interface Options {
  runing: boolean
  close: boolean
  segment: number
  points: number[][]
  tension: number
  offset: number
  factor: number
  speed: number
  index: number
  animateBack:
    | ((position: any, lookAt: any, cruiseCurve: any, progress: number) => void)
    | undefined
}
