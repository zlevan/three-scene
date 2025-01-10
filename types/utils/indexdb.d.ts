interface DbGtKeyResult {
  path: string
  data: ArrayBuffer | string
}

// 删除 db
export function deleteDB(dbName: string): Promise<boolean>

//获取当前的版本号
export function getDBVersion(
  dbName: string,
  version: number,
  tbName: string
): Promise<number>

// 创建数据库
export function createDB(
  tbName: string,
  dbName: string,
  version: number
): Promise<IDBDatabase | undefined>

// 获取数据
export function getDataByKey(
  db: any,
  objectStoreName: string,
  key: string
): Promise<DbGtKeyResult | null>

// 获取所有数据
export function getAllData(
  db: any,
  objectStoreName: string
): Promise<DbGtKeyResult[] | null>
