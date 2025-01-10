import type { Options } from '../../upload'

interface UseUpload {
  uploadModel: (files: any[], onSuccess: Function, onProgress?: Function) => void
}

// 上传 upload
export declare function useUpload(options?: import('../../utils').DeepPartial<Options>): UseUpload
