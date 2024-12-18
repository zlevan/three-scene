// 事件 event
export const useEvent = () => {
  const eventMap = new Set()

  const bindEvent = (
    type: keyof WindowEventMap,
    listener,
    opts: boolean | AddEventListenerOptions = false
  ) => {
    window.addEventListener(type, listener, opts)

    eventMap[type] = listener
  }

  const removeEvent = () => {
    Object.keys(eventMap).forEach(type => {
      console.log(type)
      window.removeEventListener(type, eventMap[type])
    })
  }

  return {
    bindEvent,
    removeEvent
  }
}
