import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'

const CardInformationBox = styled.div`
  background-color: lightblue;
  width: 40em;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`

const CardInformation = ({ card, pointerCoordinates }) => {
  const { x, y } = pointerCoordinates
  const cardInformationRef = useRef()
  const [top, setTop] = useState(y)

  useEffect(() => {
    const boxDimensions = cardInformationRef.current.getBoundingClientRect()
    if (boxDimensions.bottom > window.innerHeight) {
      const difference = boxDimensions.bottom - window.innerHeight
      const newTop = boxDimensions.top - difference
      setTop(newTop)
    }
  }, [])

  return(
    <CardInformationBox ref={cardInformationRef} x={x} y={top}>
      {card.rulesText}
    </CardInformationBox>
  )
}

export default CardInformation