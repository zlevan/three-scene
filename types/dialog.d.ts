import type { ThreeModelItem, ObjectItem } from './model'

export declare interface Dialog {
  show: boolean
  style: {
    left: string
    top: string
  }
  select: ThreeModelItem[]
  title: string
  data: Partial<ObjectItem>
  position: {
    left?: number
    top?: number
  }
}
