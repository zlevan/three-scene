interface UseKeyboardState {
  /**
   * 按键是否按下
   * @param { string | string [] } keys 被按下的按键
   * @returns { boolean }
   * @example
   * const isPressed = keyboardPressed('W')
   * const isPressed = keyboardPressed('W+A')
   * const isPressed = keyboardPressed(['W', 'A'])
   * const isPressed = keyboardPressed(['W+A', 'S+D'])
   */
  keyboardPressed: (keys: string | string[]) => boolean

  /**
   * 插入事件
   * @param { Function } onKeydown 键盘按下事件
   * @param { Function } onKeyup 键盘抬起事件
   */
  insertEvent: (
    onKeydown?: (event: KeyboardEvent) => void,
    onKeyup?: (event: KeyboardEvent) => void
  ) => void

  /**
   * 销毁事件
   */
  destroyEvent: () => void
}

/**
 * 键盘状态 keyboardState
 * @returns { UseKeyboardState }
 */
export function useKeyboardState(): UseKeyboardState
