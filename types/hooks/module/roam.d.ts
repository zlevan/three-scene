import type { Options } from '../../roam'

interface UseRoam {
  createRoam: (options?: import('../../utils').DeepPartial<Options>) => void
  updateRoam: (options: import('../../utils').DeepPartial<Options>) => void
  executeRoam: (camera: any, controls: any) => void
  pause: () => void
  play: () => void
  reset: (options: import('../../utils').DeepPartial<Options>) => void
  getStatus: () => import('../../utils').getType<Options, 'runing'>
}
// 漫游 roam
export declare function useRoam(): UseRoam
