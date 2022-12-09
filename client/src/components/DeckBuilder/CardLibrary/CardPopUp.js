import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import ManaSymbols from './ManaSymbols'
import { transformCardTextToArray } from '../../../utils/card_property_utils'

const PaddedText = styled.span`
  padding: 0 3px 0 3px;
`

const PaddedDiv = styled.div`
  padding: 0 3px 0 3px;
`

const CardContainer = styled.div`
  background-color: ${props => props.theme.cardColors[props.cardColor]};
  width: 20em;
  height: 28em;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  border: 8px solid darkgrey;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TopRow = styled.div`
  background-color: gainsboro;
  border: 2px solid darkgrey;
  margin: 6px 3px 3px 3px;
  display: flex;
  width: 96%;
  border-radius: 5px;
  justify-content: space-between;
`

const MockPicture = styled.div`
  background-color: gainsboro;
  height: 10em;
  width: 96%;
  border: 2px solid darkgrey;
  border-radius: 5px;
  margin: 3px;
`

const MidRow = styled.div`
  background-color: gainsboro;
  border: 2px solid darkgrey;
  width: 96%;
  border: 2px solid darkgrey;
  border-radius: 5px;
  margin: 3px;
  display: flex;
  justify-content: space-between;
`

const CardInformationBox = styled.div`
  background-color: gainsboro;
  border: 2px solid darkgrey;
  border: 2px solid darkgrey;
  width: 96%;
  border-radius: 5px;
  margin: 3px;
  height: 100%;
  font-size: 0.8em;
`

const CardPopUp = ({ card, pointerCoordinates }) => {
  const { x, y } = pointerCoordinates
  const cardInformationRef = useRef()
  const [top, setTop] = useState(y)
  const rulesTextArray = transformCardTextToArray(card)

  useEffect(() => {
    const boxDimensions = cardInformationRef.current.getBoundingClientRect()
    if (boxDimensions.bottom > window.innerHeight) {
      const newTop = window.innerHeight - boxDimensions.height
      setTop(newTop)
    }
  }, [])

  return(
    <CardContainer
      ref={cardInformationRef} x={x} y={top} cardColor={card.cardColor}
    >
      <TopRow>
        <PaddedText>{card.name}</PaddedText>
        <ManaSymbols
          manaSymbols={card.manaSymbols}
          cardName={card.name}
        />
      </TopRow>
      <MockPicture cardColor={card.cardColor}/>
      <MidRow>
        <PaddedText>{card.rarity}</PaddedText>
        <PaddedText>{card.price}{'\u20AC'}</PaddedText>
      </MidRow>
      <CardInformationBox>
        <PaddedDiv>{rulesTextArray
          .map((row, index) => <p key={`${index}-rulesText`}>{row}</p>)}</PaddedDiv>
      </CardInformationBox>
    </CardContainer>
  )
}

export default CardPopUp