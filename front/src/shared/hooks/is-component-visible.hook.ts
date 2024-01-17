import { useState, useRef, useEffect } from 'react'

export const useIsComponentVisible = () => {
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(false)
  const ref = useRef<any>(null)

  //   const handleHideDropdown = (event: ) => {
  //     if (event.key === 'Escape') {
  //       setIsComponentVisible(false)
  //     }
  //   }

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && event.target && !ref.current.contains(event.target)) {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return { ref, isComponentVisible, setIsComponentVisible }
}
