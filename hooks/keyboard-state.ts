// 事件 KeyboardState
export const useKeyboardState = () => {
  // 修饰按键
  const MODIFIERS = ['shift', 'ctrl', 'alt', 'meta']
  // 按键别名 对应值
  const ALIAS = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    pageup: 33,
    pagedown: 34,
    tab: 9
  }

  const _keyCodes = {}
  const _modifiers = {}

  // 插入回调
  let _onKeydownCall: (event) => void
  let _onKeyupCall: (event) => void

  const _onKeyChange = (event, pressed) => {
    var keyCode = event.keyCode
    _keyCodes[keyCode] = pressed

    // 更新修饰状态
    _modifiers['shift'] = event.shiftKey
    _modifiers['ctrl'] = event.ctrlKey
    _modifiers['alt'] = event.altKey
    _modifiers['meta'] = event.metaKey
  }

  const _onKeyDown = event => {
    _onKeyChange(event, true)
    if (typeof _onKeydownCall === 'function') _onKeydownCall(event)
  }

  const _onKeyUp = event => {
    _onKeyChange(event, false)
    if (typeof _onKeyupCall === 'function') _onKeyupCall(event)
  }

  // 事件插入
  const insertEvent = (onKeydown, onKeyup) => {
    _onKeydownCall = onKeydown
    _onKeyupCall = onKeyup
  }

  // 绑定事件
  document.addEventListener('keydown', _onKeyDown, false)
  document.addEventListener('keyup', _onKeyUp, false)

  // 检测按下的按键(可组合键 alt+W)
  const detection = (keyDesc: string) => {
    var keys = keyDesc.split('+')
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var pressed
      // 组合按键
      if (MODIFIERS.indexOf(key) !== -1) {
        pressed = _modifiers[key]
      }
      // 方向
      else if (Object.keys(ALIAS).indexOf(key) != -1) {
        pressed = _keyCodes[ALIAS[key]]
      } else {
        pressed = _keyCodes[key.toUpperCase().charCodeAt(0)]
      }
      if (!pressed) return false
    }
    return true
  }

  const keyboardPressed = (keys: string | string[]) => {
    if (Array.isArray(keys)) {
      return keys.findIndex(detection) > -1
    }
    return detection(keys)
  }

  const destroyEvent = () => {
    document.removeEventListener('keydown', _onKeyDown, false)
    document.removeEventListener('keyup', _onKeyUp, false)
  }

  return {
    keyboardPressed,
    insertEvent,
    destroyEvent
  }
}
