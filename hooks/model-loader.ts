import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { deepMerge, getUrl } from '../utils'
import * as UTILS from '../utils/model'
import type { ModelItem } from '../types/model'
import type { Colors } from '../types/color'
import type { IndexDB } from '../types/indexdb'

import * as IDB from '../utils/indexdb'
import DEFAULTCONFIG from '../config'
export declare interface ProgressListItem {
  name: string
  percentage: number
}

export declare interface Progress {
  percentage: number
  show: boolean
  isEnd: boolean
  list: ProgressListItem[]
  total: number
  loaded: number
}

export declare interface Options {
  baseUrl: string
  dracoPath: string
  modelSizeKB: number
  colors: Colors
  loadCache: boolean
  colorMeshName: string[]
  indexDB: IndexDB
}

export declare type Params = import('../types/utils').DeepPartial<Options>

export const useModelLoader = (options: Params = {}) => {
  // 数据库
  let gDB: IDBDatabase

  // 颜色
  const color = {
    normal: 0x88a1b5,
    runing: 0x2e77f8,
    error: 0xc20c00
  }
  // 默认参数
  const _options: Options = deepMerge(
    {
      // 资源地址
      baseUrl: '',
      // draco 解压文件目录
      dracoPath: '/draco/gltf/',
      // 模型 KB 倍数
      modelSizeKB: 1024 * 1024,
      // 颜色
      colors: {
        // 正常
        normal: {
          color: color.normal
        },
        // 运行
        runing: {
          color: color.runing
        },
        // 故障
        error: {
          color: color.error
        }
      },
      // 加载缓存
      loadCache: true,
      // 改变颜色材质网格名称集合
      colorMeshName: [],
      indexDB: {
        cache: true
      }
    },
    options
  )

  const progress = reactive<Progress>({
    // 进度
    percentage: 0,
    // 进度条展示
    show: false,
    // 是否加载结束（用于加载全部）
    isEnd: false,
    // 加载列表
    list: [],
    // 加载文件总大小
    total: 0,
    // 已经加载大小
    loaded: 0
  })

  // 模型类型映射
  const MODEL_MAP = {
    // base-基础底座,
    base: 'base',
    // device-场景设备,
    device: 'device',
    // font-字体,
    font: 'font',
    // sprite-精灵,
    sprite: 'sprite',
    // pipe-管路贴图
    pipe: 'pipe',
    // warning-警告标识,
    warning: 'warning',
    // remote-远程状态，
    remote: 'remote',
    // local-本地标识，
    local: 'local',
    // disabled-禁用标识
    disabled: 'disabled'
  }

  const modelMap = new Map()

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(_options.baseUrl + _options.dracoPath)
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  // 重置
  const reset = (length: number) => {
    if (length == 0) {
      progress.isEnd = true
      progress.show = false
      return false
    }
    progress.isEnd = false
    progress.percentage = 0
    progress.show = true
    return true
  }

  // 计算加载大小
  const calcLoadSize = (models: ModelItem[]) => {
    for (let i = 0; i < models.length; i++) {
      progress.total += models[i].size * _options.modelSizeKB
    }
  }

  // 加载进度
  const loadProgress = res => {
    const loaded = res.loaded
    const total = progress.total
    console.log()
    let s = Number(((loaded + progress.loaded) / total) * 100)
    if (s > 100) s = 100
    progress.percentage = Number(s.toFixed(2))
  }

  // 模型归一化
  const modelNormalization = (model: ModelItem, color: string | number, glb, animations) => {
    if (!glb) return
    const { baseUrl, colorMeshName } = _options
    const { mapUrl, key, mapMeshName, repeat = [1, 1] } = model
    let texture: InstanceType<typeof THREE.TextureLoader>
    if (mapUrl && mapMeshName) {
      texture = new THREE.TextureLoader().load(getUrl(mapUrl, baseUrl))
      texture.wrapS = THREE.RepeatWrapping // THREE.RepeatWrapping，纹理将简单地重复到无穷大。
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeat[0], repeat[1]) // 纹理对象阵列
    }
    // 克隆
    const newModel = UTILS.deepClone(glb)
    newModel.traverse(el => {
      if (el.isMesh && texture && el.name.indexOf(mapMeshName)) {
        el.material = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          map: texture.clone()
        })
      } else {
        // 默认颜色 动画颜色
        UTILS.replaceMaterial(el, color, colorMeshName || [])
      }
    })

    newModel.animations = animations
    modelMap.set(key, newModel)
    return newModel
  }

  // 打开数据库
  const openDB = () => {
    // 创建数据库
    return IDB.createDB(
      _options.indexDB?.tbName || DEFAULTCONFIG.indexdb.tbName,
      _options.indexDB?.dbName || DEFAULTCONFIG.indexdb.dbName,
      _options.indexDB?.version || DEFAULTCONFIG.indexdb.version
    ).then(db => {
      if (!!db) {
        // 开启缓存
        THREE.Cache.enabled = true
        gDB = db
      }
      return db
    })
  }

  // 获取缓存模型数据
  const getCacheModel = (url: string, size: number = 0): Promise<any> => {
    const loader = new GLTFLoader()
    return new Promise(async resolve => {
      // 加载缓存
      if (!_options.indexDB.cache) resolve(null)
      // three 缓存
      const tCache = THREE.Cache.get(url)
      if (!!tCache) {
        // 判断缓存的是否为 buffer 类型数据
        if (tCache instanceof ArrayBuffer) {
          loadProgress({ loaded: tCache.byteLength })
          loader.parse(tCache, '', result => {
            THREE.Cache.add(url, result)
            resolve(result)
          })
        } else {
          loadProgress({ loaded: size * _options.modelSizeKB })
          setTimeout(() => {
            resolve(tCache)
          }, 10)
        }
      } else {
        // 数据库查询
        const store = await IDB.getDataByKey(gDB, _options.indexDB?.tbName || DEFAULTCONFIG.indexdb.tbName, url)
        if (!!store && store.data) {
          const data = store.data
          if (typeof data === 'string') {
            loadProgress({ loaded: data.length })
            THREE.Cache.add(store.path, data)
            setTimeout(() => {
              resolve(data)
            }, 10)
          } else {
            loadProgress({ loaded: data.byteLength })
            loader.parse(data, '', result => {
              THREE.Cache.add(store.path, result)
              resolve(result)
            })
          }
        } else {
          resolve(null)
        }
      }
    })
  }

  // db 缓存
  const dbStoreAdd = url => {
    // 加载缓存
    if (!_options.indexDB.cache) return
    const ch = THREE.Cache.get(url)
    if (!ch) return
    if (!!gDB) {
      const gDBTableName = _options.indexDB?.tbName || DEFAULTCONFIG.indexdb.tbName
      const db_tb = gDB.transaction(gDBTableName, 'readwrite').objectStore(gDBTableName)
      db_tb.add({ path: url, data: ch })
    }
  }

  // 加载模型
  const loadModel = (model: ModelItem, onProgress?: Function): Promise<any> => {
    const { key, url = '', size = 0 } = model
    const { baseUrl, colors } = _options
    return new Promise(async (resolve, reject) => {
      let color = colors.normal[key] || colors.normal.color
      color = UTILS.getColorArr(color)[0]
      const newUrl = getUrl(url, baseUrl)

      // 缓存
      const store = await getCacheModel(url, size)
      if (store) {
        const obj = store.scene.children[0]
        const del = modelNormalization(model, color, obj, store.animations)
        resolve(del)
        return
      }

      // 判断文件类型是否为 glb
      let tmpArr = newUrl.split('.')
      let type = tmpArr.pop().toLowerCase()
      if (type !== 'glb') {
        throw new Error('模型类型错误,必须为 GLB 格式，当前格式：' + type)
      }

      loader.load(
        newUrl,
        glb => {
          let obj = glb.scene.children[0]
          const del = modelNormalization(model, color as string | number, obj, glb.animations)
          dbStoreAdd(newUrl)
          resolve(del)
        },
        res => {
          loadProgress(res)
          if (typeof onProgress === 'function') onProgress(res)
        },
        reject
      )
    })
  }

  // 创建精灵
  const createSprite = (item: ModelItem) => {
    const { key, range = { x: 1, y: 1 }, mapUrl = '' } = item
    // 创建精灵
    let texture = new THREE.TextureLoader().load(_options.baseUrl + mapUrl)
    // 精灵材质
    let material = new THREE.SpriteMaterial({
      map: texture
    })
    let sprite = new THREE.Sprite(material)
    let x = range.x,
      y = range.y

    sprite.scale.set(x, y, 1)
    sprite.name = 'sprite'
    modelMap.set(key, sprite)
  }

  // 加载字体
  let fontParser: InstanceType<typeof FontLoader>
  const loadFont = (model: ModelItem) => {
    const { url = '', size = 0 } = model
    const { baseUrl } = _options
    const newUrl = getUrl(url, baseUrl)
    const loader = new FontLoader()

    return new Promise(async resolve => {
      const store = await getCacheModel(newUrl, size)
      if (store) {
        fontParser = loader.parse(JSON.parse(store))
        setTimeout(() => {
          resolve(fontParser)
        }, 10)
        return
      }

      loader.load(newUrl, font => {
        fontParser = font
        dbStoreAdd(url)
        resolve(font)
      })
    })
  }

  // 加载全部模型
  const loadModels = async (models: ModelItem[], onSuccess: Function, onProgress?: Function) => {
    await openDB()
    const max = models.length
    if (!reset(max)) return
    // 计算模型文件总大小
    calcLoadSize(models)

    let index = 0
    const _load = async () => {
      const item = models[index]
      const { type = MODEL_MAP.device, size = 0 } = item
      switch (type) {
        case MODEL_MAP.device:
          await loadModel(item, onProgress)
          break
        case MODEL_MAP.sprite:
          createSprite(item)
          break
        case MODEL_MAP.font:
          loadFont(item)
          break
      }

      index++
      progress.loaded += size * _options.modelSizeKB
      // 加载完成
      if (index >= max) {
        onSuccess()
      } else {
        _load()
      }
    }
    _load()
  }

  // 获取缓存模型
  const getModel = key => modelMap.get(key)

  return {
    progress,
    MODEL_MAP,
    loadModel,
    loadModels,
    getModel
  }
}