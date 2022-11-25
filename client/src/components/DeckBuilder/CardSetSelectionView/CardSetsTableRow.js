import { useState, useEffect, useContext } from 'react'
import { deleteCardSet } from '../../../services/card_sets'
import styled from 'styled-components'
import CardSetDescriptionBox from './CardSetDescriptionBox'
import { notificationMessageContext } from '../../../contexts/notificationMessageContext'
import CardSetDeletionError from './Notifications/CardSetDeletionError'

const TableCell = styled.td`
  padding: 0.5em;
  text-align: center;
`
const TableRow = styled.tr`
  background: ${props => props.isSelected ? '#3AAFA9' : '#DEF2F1'};
`

const CardSetsTableRow = ({
  cardSet,
  selectCardSetRow,
  selectedCardSet,
  isRowSelected,
  dispatchCardSetsList
}) => {
  const [isSelected, setIsSelected] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const { showNotificationMessage } = useContext(notificationMessageContext)

  useEffect(() => {
    const selected = isRowSelected(cardSet)
    setIsSelected(selected)
  }, [selectedCardSet])

  const selectThisRow = () => {
    selectCardSetRow(cardSet)
  }

  const toggleDescription = () => {
    setShowDescription(!showDescription)
  }

  const removeCardSet = async () => {
    try {
      await deleteCardSet(cardSet.id)
      dispatchCardSetsList({
        type: 'DELETE_CARD_SET',
        payload: cardSet
      })
    } catch(error) {
      showNotificationMessage(CardSetDeletionError)
      console.log(error)
    }
  }

  return(
    <TableRow isSelected={isSelected}>
      <TableCell onClick={selectThisRow}>
        {cardSet.name}
      </TableCell>
      <TableCell onClick={selectThisRow}>{cardSet.date.toLocaleDateString()}</TableCell>
      <TableCell>
        <button onClick={toggleDescription}>
          { showDescription === true
            ? 'Close'
            : 'Open'
          }
        </button>
        <button onClick={removeCardSet}>Delete</button>
        { showDescription === true
          ? <CardSetDescriptionBox description={cardSet.description} />
          : null
        }
      </TableCell>
    </TableRow>
  )
}

export default CardSetsTableRow