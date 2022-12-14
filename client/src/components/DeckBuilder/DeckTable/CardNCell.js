import styled from 'styled-components'
import { useContext }  from 'react'
import { OpenedDeckContext } from '../../../contexts/openedDeckContext'

const CardNContainer = styled.div`
  display: flex;
  gap: 0.3em;
`

const NChangeButton = styled.button`
  ${props => props.theme.components.buttons.tableButton.normal};
  &:hover {
    ${props => props.theme.components.buttons.tableButton.hovered};
}`

const ButtonText = styled.span`
  ${props => props.theme.components.texts.tableButtonText};
  font-size: 0.8em
`

const CardNCell = ({ card }) => {
  const { addCardToDeck, removeCardFromDeck } = useContext(OpenedDeckContext)

  const addCard = () => {
    addCardToDeck(card, 1)
  }

  const removeCard = () => {
    removeCardFromDeck(card, 1)
  }

  return(
    <CardNContainer>
      <NChangeButton onClick={removeCard}>
        <ButtonText>
          {'\u2013'}
        </ButtonText>
      </NChangeButton>
      {card.nInDeck}
      <NChangeButton onClick={addCard}>
        <ButtonText>
          +
        </ButtonText>
      </NChangeButton>
    </CardNContainer>
  )
}

export default CardNCell