import { Reactive, toRef } from 'vue'

import type { Options } from '../../dialog'

interface UseDialog {
  dialog: Reactive<import('../../utils').DeepPartial<Options>>
  options: Reactive<import('../../utils').DeepPartial<Options>>
  show: toRef<import('../../utils').getType<Options, 'show'>>
}

// 弹窗配置
export declare function useDialog(options?: import('../../utils').DeepPartial<Options>): UseDialog
