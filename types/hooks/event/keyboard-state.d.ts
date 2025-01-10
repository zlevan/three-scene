interface UseKeyboardState {
  keyboardPressed: (keys: string | string[]) => boolean
  insertEvent: (
    onKeydown: (event: KeyboardEvent) => void,
    onKeyup: (event: KeyboardEvent) => void
  ) => void
  destroyEvent: () => void
}

// 事件 KeyboardState
export declare function useKeyboardState(): UseKeyboardState
