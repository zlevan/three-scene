import { reactive } from 'vue'

export const useDialog = () => {
  const dialog = reactive<import('../types/dialog').Dialog>({
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
  })
  return {
    dialog
  }
}
