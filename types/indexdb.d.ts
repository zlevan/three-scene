export interface IndexDB {
  // indexdb

  // 加载缓存 默认: true
  cache?: boolean

  // 数据库名称
  dbName: string
  // 表名称
  tbName: string
  // 版本号
  version: number
}
