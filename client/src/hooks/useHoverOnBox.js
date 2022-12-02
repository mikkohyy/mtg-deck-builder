import { useState } from 'react'

const useHoverOnBox = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [pointerCoordinates, setPointerCoordinates] = useState({ x: undefined, y: undefined })
  const [hoverTimeout, setHoverTimeout] = useState(undefined)
  const [pointerMoveTimeout, setPointerMoveTimeout] = useState(undefined)

  const pointerEntered = (event) => {
    setHoverTimeout(fadeIn(event))
  }

  const pointerMoved = (event) => {
    clearTimeout(hoverTimeout)
    clearTimeout(pointerMoveTimeout)

    setPointerMoveTimeout(
      setTimeout(() => {
        setHoverTimeout(fadeIn(event))
      }, 20))
  }

  const pointerLeft = () => {
    clearTimeout(hoverTimeout)
    clearTimeout(pointerMoveTimeout)
    setIsVisible(false)
    setPointerCoordinates({ x: undefined, y: undefined })
  }

  const fadeIn = (event) => {
    const fadeInTimeout = setTimeout(() => {
      const newX = pointerCoordinates.x === undefined ? event.clientX : pointerCoordinates.x
      const newY = pointerCoordinates.y === undefined ? event.clientX : pointerCoordinates.y

      const newPointerCoordinates = {
        x: newX,
        y: newY
      }

      setPointerCoordinates(newPointerCoordinates)
      setIsVisible(true)
    }, 750)

    return fadeInTimeout
  }

  return {
    pointerLeft,
    isVisible,
    pointerCoordinates,
    pointerMoved,
    pointerEntered
  }
}

export default useHoverOnBox