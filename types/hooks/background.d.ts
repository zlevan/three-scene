type Skys =
  | '216'
  | '217'
  | '218'
  | '219'
  | '220'
  | '221'
  | '222'
  | '223'
  | '224'
  | '225'
  | '226'
  | '227'
  | '228'

interface UseBackground {
  /**
   * 天空盒子背景组列表
   */
  skys: Skys[]

  /**
   * 当前索引
   */
  index: number

  /**
   * 切换天空背景
   * @param { any } scene 场景对象
   */
  change: (scene: any) => void

  /**
   * 切换天空背景
   * @param { any } scene 场景对象
   */
  changeBackground: (scene: any) => void

  /**
   * 获取背地址景组
   * @param { string } code 天空背景 code
   * @param { string } suffix 图片后缀（jpeg、jpg、png）
   * @returns { string[] } 背景地址组
   */
  getBgGroup: (code: Skys, suffix?: string) => string[]

  /**
   * 加载天空背景
   * @param { any } scene 场景对象
   * @param { string } code 天空背景 code
   * @param { string } suffix 图片后缀（jpeg、jpg、png）
   */
  load: (scene: any, code: Skys, suffix?: string) => void

  /**
   * 加载天空背景
   * @param { any } scene 场景对象
   * @param { string } code 天空背景 code
   * @param { string } suffix 图片后缀（jpeg、jpg、png）
   */
  backgroundLoad: (scene: any, code: Skys, suffix?: string) => void
}

// 背景
export declare function useBackground(code?: Skys): UseBackground
