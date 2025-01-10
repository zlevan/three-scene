export interface Options {
  /**
   * 运行中
   */
  runing: boolean

  /**
   * 是否闭合
   */
  close: boolean

  /**
   * 分段
   */
  segment: number

  /**
   * 点位
   */
  points: number[][]

  /**
   * 曲线张力
   */
  tension: number

  /**
   * 视角偏差
   */
  offset: number

  /**
   * 系数
   */
  factor: number

  /**
   * 移动速度
   */
  speed: number

  /**
   * 索引
   */
  index: number

  /**
   * 帧动画回调
   */
  animateBack:
    | ((position: any, lookAt: any, cruiseCurve: any, progress: number) => void)
    | undefined
}
