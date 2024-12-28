import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'

import { deepMerge, getUrl } from '../utils'
import * as UTILS from '../utils'
import type { ModelItem, ThreeModelItem } from '../types/model'

import { reactive } from 'vue'

import * as IDB from '../utils/indexdb'
import DEFAULTCONFIG from '../config'

import type { Progress, Options, VtOptions } from '../types/model-loader'

// 模型加载 model-loader
export const useModelLoader = (options: import('../types/utils').DeepPartial<Options> = {}) => {
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
      dracoPath: '/three/draco/gltf/',
      // basis 解压文件目录
      basisPath: '/three/basis/',
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
    disabled: 'disabled',
    // 聚光灯
    spotlight: 'spotlight'
  }

  const modelMap = new Map()

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(_options.baseUrl + _options.dracoPath)
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  const ktx2Loader = new KTX2Loader()
  ktx2Loader.setTranscoderPath(_options.baseUrl + _options.basisPath)
  loader.setKTX2Loader(ktx2Loader)

  loader.setMeshoptDecoder(MeshoptDecoder)

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
      progress.total += (models[i].size || 0) * _options.modelSizeKB
    }
  }

  // 加载进度
  const loadProgress = (res: { loaded: number }) => {
    const loaded = res.loaded
    const total = progress.total
    let s = Number(((loaded + progress.loaded) / total) * 100)
    if (s > 100) s = 100
    progress.percentage = Number(s.toFixed(2))
  }

  // 模型归一化
  const modelNormalization = (
    model: ModelItem,
    color: string | number,
    glb: any,
    animations: any[]
  ) => {
    if (!glb) return
    const { baseUrl, colorMeshName } = _options
    const { mapUrl, key, mapMeshName, repeat = [1, 1] } = model
    // let texture: InstanceType<typeof THREE.TextureLoader>
    let texture: any
    if (mapUrl && mapMeshName) {
      texture = new THREE.TextureLoader().load(getUrl(mapUrl, baseUrl) as string)
      texture.wrapS = THREE.RepeatWrapping // THREE.RepeatWrapping，纹理将简单地重复到无穷大。
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeat[0], repeat[1]) // 纹理对象阵列
    }
    // 克隆
    const newModel = UTILS.modelDeepClone(glb)
    newModel.traverse((el: any) => {
      if (el.isMesh && texture && el.name.indexOf(mapMeshName) > -1) {
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
    if (mapUrl && mapMeshName) {
      newModel._mapMeshName_ = mapMeshName
    }

    newModel.animations = animations
    if (key) {
      modelMap.set(key, newModel)
    }
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
        const store = await IDB.getDataByKey(
          gDB,
          _options.indexDB?.tbName || DEFAULTCONFIG.indexdb.tbName,
          url
        )
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
  const dbStoreAdd = (url: string) => {
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
      const newUrl = getUrl(url, baseUrl) as string

      // 缓存
      const store = await getCacheModel(newUrl, size)
      if (store) {
        const obj = store.scene.children[0]
        const del = modelNormalization(model, color, obj, store.animations)
        resolve(del)
        return
      }

      // 判断文件类型是否为 glb
      let tmpArr = newUrl.split('.')
      let type = (tmpArr.pop() || '').toLowerCase()
      if (type !== 'glb') {
        throw new Error('模型类型错误,必须为 GLB 格式，当前格式：' + type)
      }

      loader.load(
        newUrl,
        glb => {
          const children = glb.scene.children
          let object: any = new THREE.Group()
          if (children.length > 1) {
            object.add(...children)
          } else {
            object = children[children.length - 1]
          }

          const del = modelNormalization(model, color as string | number, object, glb.animations)
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
  const loadFont = (model: ModelItem, onProgress?: Function) => {
    const { url = '', size = 0 } = model
    const { baseUrl } = _options
    const newUrl = getUrl(url, baseUrl) as string
    const loader = new FontLoader()

    return new Promise(async (resolve, reject) => {
      const store = await getCacheModel(newUrl, size)
      if (store) {
        const font = loader.parse(JSON.parse(store))
        modelMap.set(MODEL_MAP.font, font)
        setTimeout(() => {
          resolve(font)
        }, 10)
        return
      }

      loader.load(
        newUrl,
        font => {
          modelMap.set(MODEL_MAP.font, font)
          dbStoreAdd(newUrl)
          resolve(font)
        },
        res => {
          loadProgress(res)
          if (typeof onProgress === 'function') onProgress(res)
        },
        reject
      )
    })
  }

  // 创建聚光灯
  const createSpotlight = (item: ModelItem) => {
    const {
      key,
      color = 0xffffff,
      intensity = 8,
      distance = 10,
      angle = Math.PI * 0.2,
      penumbra = 0.2,
      decay = 0
    } = item
    // 创建光源
    // 点光源 (颜色、强度、距离、角度、半影衰减、衰减)
    let spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
    // 生产阴影
    spotLight.castShadow = true
    spotLight.visible = false
    modelMap.set(key, spotLight)
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
        case MODEL_MAP.pipe:
          await loadModel(item, onProgress)
          break
        case MODEL_MAP.sprite:
          createSprite(item)
          break
        case MODEL_MAP.font:
          await loadFont(item, onProgress)
          break
        case MODEL_MAP.warning:
          item.key = MODEL_MAP.warning
          await loadModel(item, onProgress)
          break
        case MODEL_MAP.local:
          item.key = MODEL_MAP.local
          await loadModel(item, onProgress)
          break
        case MODEL_MAP.disabled:
          item.key = MODEL_MAP.disabled
          await loadModel(item, onProgress)
          break
        case MODEL_MAP.spotlight:
          createSpotlight(item)
          break
      }

      index++
      progress.loaded += size * _options.modelSizeKB
      // 加载完成
      if (index >= max) {
        progress.percentage = 100
        progress.isEnd = true
        onSuccess()
      } else {
        _load()
      }
    }
    _load()
  }

  // 获取缓存模型
  const getModel = (key: string) => {
    const model = modelMap.get(key)
    return model
  }

  // 设置模型虚化
  const setModelVirtualization = (
    model: any,
    opts: import('../types/utils').DeepPartial<VtOptions> = {}
  ) => {
    // 默认参数
    opts = deepMerge(
      {
        color: 0x00e0ff,
        wireframe: true,
        opacity: 0.5,
        filter: [],
        filterMatch: []
      },
      opts
    )
    model.traverse((el: any) => {
      if (opts.filter?.includes(el.name) || matchFilter(el.name, opts.filterMatch)) {
        return
      }
      if (el.isMesh) {
        if (!el.__material__) {
          el.__material__ = el.material
        }
        el.material = new THREE.MeshBasicMaterial({
          color: opts.color,
          wireframe: opts.wireframe,
          transparent: true,
          opacity: opts.opacity
        })
      }
    })
  }

  // 匹配过滤
  const matchFilter = (name: string = '', filters: string[] = []) => {
    return filters.filter(match => name.indexOf(match) > -1).length > 0
  }

  // 虚化模型 其他模型传入则虚化除目标之外的模型
  const virtualization = (
    models: ThreeModelItem[] = [],
    model: ThreeModelItem,
    opts: import('../types/utils').DeepPartial<VtOptions> = {}
  ) => {
    const filter = opts.filter || []
    const filterMatch = opts.filterMatch || []
    if (models.length) {
      for (let i = 0; i < models.length; i++) {
        const mod = models[i]
        if (
          model.uuid !== mod.uuid &&
          !filter.includes(mod.name) &&
          !matchFilter(mod.name, filterMatch)
        ) {
          setModelVirtualization(mod, opts)
        }
      }
    } else {
      // 虚化材质
      setModelVirtualization(model, opts)
    }
  }

  // 关闭虚化
  const closeVirtualization = (model: any) => {
    if (Array.isArray(model)) {
      for (let i = 0; i < model.length; i++) {
        model[i].traverse((el: any) => {
          if (el.isMesh && el.__material__) {
            el.material = el.__material__
          }
        })
      }
    } else {
      model.traverse((el: any) => {
        if (el.isMesh && el.__material__) {
          el.material = el.__material__
        }
      })
    }
  }

  return {
    progress,
    MODEL_MAP,
    loadModel,
    loadModels,
    getModel,
    virtualization,
    closeVirtualization
  }
}
