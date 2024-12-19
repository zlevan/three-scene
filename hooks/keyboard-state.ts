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
  }

  const _onKeyUp = event => {
    _onKeyChange(event, false)
  }

  // 绑定事件
  document.addEventListener('keydown', _onKeyDown, false)
  document.addEventListener('keyup', _onKeyUp, false)

  // 检测按下的按键(可组合键 alt+W)
  const pressed = keyDesc => {
    var keys = keyDesc.split('+')
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var pressed
      if (MODIFIERS.indexOf(key) !== -1) {
        pressed = _modifiers[key]
      } else if (Object.keys(ALIAS).indexOf(key) != -1) {
        pressed = _keyCodes[ALIAS[key]]
      } else {
        pressed = _keyCodes[key.toUpperCase().charCodeAt(0)]
      }
      if (!pressed) return false
    }
    return true
  }

  const destroyEvent = () => {
    document.removeEventListener('keydown', _onKeyDown, false)
    document.removeEventListener('keyup', _onKeyUp, false)
  }

  return {
    pressed,
    destroyEvent
  }
}
