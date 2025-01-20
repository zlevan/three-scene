export interface IndexDB {
  // indexdb

  /**
   * 加载缓存
   * @default true
   */
  cache?: boolean

  /**
   * 数据库名称
   */
  dbName: string
  /**
   * 表名称
   */
  tbName: string
  /**
   * 版本号
   */
  version: number
}
