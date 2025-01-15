import type { ModelItem, ObjectItem, ThreeModelItem } from '../model'

import { Reactive } from 'vue'

import type { Progress, Options, VtOptions, ModelMap } from '../model-loader'

interface UseModelLoader {
  /**
   * 加载进度
   */
  progress: Reactive<Progress>

  /**
   * 模型映射
   */
  MODEL_MAP: ModelMap

  /**
   * 加载模型
   * @param { ModelItem } model 模型
   * @param { Function } onProgress 进度回调
   * @returns { Promise }
   */
  loadModel: (model: ModelItem, onProgress?: Function) => Promise<any>

  /**
   * 加载模型列表
   * @param { ModelItem[] } models 模型列表
   * @param { Function } onSuccess 加载成功回调
   * @param { Function } onProgress 进度回调
   */
  loadModels: (models: ModelItem[], onSuccess: Function, onProgress?: Function) => void

  /**
   * 获取模型
   * @param { string } key 模型对应 key
   * @returns { any }
   */
  getModel: (key: string) => any

  /**
   * 初始化模型列表
   * @param { ObjectItem[] } objects 模型对象列表
   * @param { Function } loadCallback 加载回调函数
   */
  initModels: (
    objects: ObjectItem[],
    loadCallback: (item: ObjectItem) => Promise<any>
  ) => Promise<number>

  /**
   * 虚化模型
   * @param { ThreeModelItem[] } models 需要处理的模型列表
   * @param { ThreeModelItem } filterModel 过滤模型
   * @param { VtOptions } opts 虚化配置
   * @returns
   */
  virtualization: (
    models: ThreeModelItem[],
    filterModel: ThreeModelItem,
    opts: import('../utils').DeepPartial<VtOptions>
  ) => void

  /**
   * 关闭虚化
   * @param { any } model 需要关闭虚化的模型或者集合
   * @returns
   */
  closeVirtualization: (model: any) => void
}

/**
 * 模型加载 model-loader
 * @param options {@link Options}
 */
export declare function useModelLoader(
  options: import('../utils').DeepPartial<Options>
): UseModelLoader
