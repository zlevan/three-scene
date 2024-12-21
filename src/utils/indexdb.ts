export declare interface DbGtKeyResult {
  path: string
  data: ArrayBuffer | string
}

// 删除 db
export const deleteDB = (dbName: string) => {
  return new Promise(resolve => {
    // 删除数据库
    const request = window.indexedDB.deleteDatabase(dbName)
    console.log(request)
    request.onsuccess = _ev => {
      resolve(true)
    }
    request.onerror = ev => {
      console.log('删除失败', ev)
      resolve(false)
    }
  })
}

//获取当前的版本号
export const getDBVersion = (dbName: string, version: number, tbName: string) => {
  return new Promise(resolve => {
    //打开数据库
    var request = window.indexedDB.open(dbName)
    // 数据库成功打开时触发onsuccess事件
    request.onsuccess = (event: any) => {
      const db = event.target.result
      const ver = db.version
      // 关闭
      db.close()
      if (ver !== version) {
        deleteDB(dbName).then(b => {
          resolve(b ? version : ver)
        })
      } else {
        // 判断表是否存在
        if (!db.objectStoreNames.contains(tbName)) {
          deleteDB(dbName).then(b => {
            resolve(b ? version : ver)
          })
        } else {
          resolve(ver)
        }
      }
    }
  })
}

// 创建数据库
export const createDB = async (
  tbName: string,
  dbName = 'THREE__MODEL_DB',
  version = 1
): Promise<IDBDatabase | undefined> => {
  if (!window.indexedDB) return Promise.resolve(void 0)

  await getDBVersion(dbName, version, tbName)
  // 创建数据库 名称、版本号
  let request = window.indexedDB.open(dbName, version)
  return new Promise(resolve => {
    request.onupgradeneeded = (ev: any) => {
      const db = ev.target.result
      // 查询表是否存在
      if (!db.objectStoreNames.contains(tbName)) {
        // 创建表
        db.createObjectStore(tbName, {
          // autoIncrement: true
          keyPath: 'path'
        })
      } else {
        console.log(db)
      }
    }
    request.onsuccess = (ev: any) => {
      const db = ev.target.result
      resolve(db)
    }
    request.onerror = ev => {
      console.log('数据库打开失败', ev)
      resolve(void 0)
    }
  })
}

// 获取数据
export const getDataByKey = (
  db: any,
  objectStoreName: string,
  key: string
): Promise<DbGtKeyResult | null> => {
  if (!db || !objectStoreName || !key) return Promise.resolve(null)
  // 打开对象存储空间
  const transaction = db.transaction([objectStoreName], 'readonly')
  const store = transaction.objectStore(objectStoreName)
  // 根据指定的键值查询数据
  const request = store.get(key)
  return new Promise((resolve, reject) => {
    // 获取索引数据
    request.onsuccess = (event: Event) => {
      const target: any = event.target
      const list = target.result
      resolve(list) // 输出结果
    }
    request.onerror = (event: any) => {
      reject(event)
    }
  })
}

// 获取所有数据
export const getAllData = (db: any, objectStoreName: string): Promise<DbGtKeyResult[] | null> => {
  const db_tb = db.transaction(objectStoreName, 'readonly').objectStore(objectStoreName)
  const request = db_tb.getAll()
  return new Promise((resolve, reject) => {
    request.onsuccess = (event: Event) => {
      const target: any = event.target
      const list = target.result
      resolve(list) // 输出结果
    }
    request.onerror = (event: any) => {
      reject(event)
    }
  })
}
