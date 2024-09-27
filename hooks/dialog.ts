import { reactive, toRef } from 'vue'
import { deepMerge } from '../utils'

type Options = import('../types/dialog').Dialog

export declare type Params = import('../types/utils').DeepPartial<Options>
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
