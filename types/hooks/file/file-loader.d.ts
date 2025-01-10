import { Ref } from 'vue'

interface UseFileLoader {
  load: (url: string) => Promise<any>
  progress: Ref<number>
}

// 加载文件
export declare function useFileLoader(): UseFileLoader
