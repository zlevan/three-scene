import type { Options } from '../../floor'

interface UseFloor {
  floorAnimate: (
    list: any[],
    index: number | undefined,
    getFllowMarkFn: (mark: string) => any[]
  ) => void
}

// 楼层 floor
export declare function useFloor(options?: import('../../utils').DeepPartial<Options>): UseFloor
