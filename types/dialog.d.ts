import type { ThreeModelItem, ObjectItem } from './model'

export interface Options {
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
  extend: any
  list: any[]
}
