import { useState, useEffect, useContext } from 'react'
import { deleteCardSet } from '../../../services/card_sets'
import styled from 'styled-components'
import CardSetDescriptionBox from './CardSetDescriptionBox'
import { notificationContext } from '../../../contexts/notificationContext'
import CardSetDeletionError from './Notifications/CardSetDeletionError'
import { CardSetsContext } from '../../../contexts/cardSetsContext'

const TableCell = styled.td`
  padding: 0.5em;
  text-align: center;
`
const TableRow = styled.tr`
  background: ${props => props.isSelected ? '#3AAFA9' : '#DEF2F1'}
`

const ButtonWithSetWidth = styled.button`
  ${props => props.theme.components.buttons.tertiary};
  width: ${props => props.width};
  :hover {
    ${props => props.theme.components.buttons.hovered};
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.components.buttons.gapBetween};
`

const CardSetsTableRow = ({ cardSet, selectThisCardSetRow, selectedCardSet }) => {
  const { cardSetsDispatch } = useContext(CardSetsContext)
  const [isSelected, setIsSelected] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const { showNotification } = useContext(notificationContext)

  useEffect(() => {
    let thisSetIsSelected = false

    if (userHasSelectedThisRow() === true) {
      thisSetIsSelected = true
    }

    setIsSelected(thisSetIsSelected)
  }, [selectedCardSet])

  const userHasSelectedThisRow = () => {
    let isSelected = false

    if ((selectedCardSet !== null && selectedCardSet.id === cardSet.id)) {
      isSelected = true
    }

    return isSelected
  }

  const selectRow = () => {
    selectThisCardSetRow(cardSet)
  }

  const toggleDescription = () => {
    setShowDescription(!showDescription)
  }

  const removeCardSet = async () => {
    try {
      await deleteCardSet(cardSet.id)
      cardSetsDispatch({
        type: 'DELETE_CARD_SET',
        payload: cardSet
      })
    } catch(error) {
      showNotification(CardSetDeletionError)
      console.log(error)
    }
  }

  return(
    <TableRow isSelected={isSelected}>
      <TableCell onClick={selectRow}>
        {cardSet.name}
      </TableCell>
      <TableCell onClick={selectRow}>{cardSet.date.toLocaleDateString()}</TableCell>
      <TableCell>
        <ButtonContainer>
          <ButtonWithSetWidth width='4em' onClick={toggleDescription}>
            {showDescription === true ? 'Hide' : 'Show'}
          </ButtonWithSetWidth>
          { showDescription === true
            ? <CardSetDescriptionBox description={cardSet.description} />
            : null
          }
          <ButtonWithSetWidth width='4em' onClick={removeCardSet}>Delete</ButtonWithSetWidth>
        </ButtonContainer>
      </TableCell>
    </TableRow>
  )
}

export default CardSetsTableRow