import { OpenedDeckContext } from '../../../contexts/openedDeckContext'
import { useState, useContext } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  gap: 0.4em;
`

const NOfCardsInput = styled.input`
  width: 1em;
  text-align: center;
`

const AddButton = styled.button`
  ${props => props.theme.components.buttons.tableButton.normal};
  &:hover {
    ${props => props.theme.components.buttons.tableButton.hovered};
  }
`

const AddButtonText = styled.span`
  ${props => props.theme.components.texts.tableButtonText};
  font-size: 1em;
  font-weight: 550;
`

const AddToDeckWidget = ({ card }) => {
  const { addCardToDeck } = useContext(OpenedDeckContext)
  const [nOfCards, setNOfCards] = useState(1)

  const preventInvalidKeyPress = (event) => {
    const invalidKeys = ['.']

    if (invalidKeys.includes(event.key)) {
      event.preventDefault()
    }
  }

  const handleChange = (event) => {
    const valueAsNumber = Number(event.target.value)
    if (isNaN(valueAsNumber) === false && Number.isInteger(valueAsNumber) === true) {
      setNOfCards(event.target.value)
    }
  }

  const handleClick = () => {
    addCardToDeck(card, nOfCards)
  }

  return(
    <Container>
      <NOfCardsInput
        value={nOfCards}
        onChange={handleChange}
        type='text'
        maxLength='2'
        onKeyDown={preventInvalidKeyPress}
      />
      <AddButton onClick={handleClick}>
        <AddButtonText>
          Add
        </AddButtonText>
      </AddButton>
    </Container>
  )
}

export default AddToDeckWidget