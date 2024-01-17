import { useRef, useLayoutEffect, useCallback } from 'react'

export function useEventCallback(fn: Function) {
  const ref = useRef<Function>()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback<Function>(() => (ref.current as Function)(), [])
}
