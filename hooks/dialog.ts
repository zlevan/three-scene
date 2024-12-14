import { reactive, toRef } from 'vue'
import { deepMerge } from '../utils'

import type { Options } from '../types/dialog'

type Params = import('../types/utils').DeepPartial<Options>

// 弹窗配置
export const useDialog = (options: Params = {}) => {
  const dialog = reactive<Options>(
    deepMerge(
      {
        show: false,
        style: {
          left: '',
          top: ''
        },
        select: [],
        data: {},
        title: '',
        position: {
          top: 0,
          left: 0
        }
      },
      options
    )
  )
  const show = toRef(dialog.show)
  return {
    dialog,
    options: dialog,
    show
  }
}
