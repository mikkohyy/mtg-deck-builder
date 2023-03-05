import useTableRowSelection from '../../../hooks/useTableRowSelection'
import CardSetsTable from './CardSetsTable'
import styled from 'styled-components'
import { getCardSetWithId, deleteCardSet } from '../../../services/card_sets'
import { useContext } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import { CardSetsContext } from '../../../contexts/cardSetsContext'
import { notificationContext } from '../../../contexts/notificationContext'
import ButtonGroup from '../../Generic/ButtonGroup'
import SubWindowNavigationButton from '../../Generic/SubWindowNavigationButton'
import Notification from '../../Generic/Notification'

const CardSetsContainer = styled.div`
  ${props => props.theme.components.containers.subWindow}
`

const CardSetsList = ({ setSelectCardSetIsOpen, setActiveSubWindow }) => {
  const { selectThisTableRow, selectedTableRow } = useTableRowSelection()
  const { setOpenedCardSet } = useContext(OpenedCardSetContext)
  const { showNotification } = useContext(notificationContext)
  const { cardSetsDispatch } = useContext(CardSetsContext)

  const closeCardSetsList = () => {
    setSelectCardSetIsOpen(false)
    setActiveSubWindow(undefined)
  }

  const openSelectedCardSet = async() => {
    if (selectedTableRow !== undefined) {
      try {
        const cardSetId = selectedTableRow.id
        const data = await getCardSetWithId(cardSetId)
        setOpenedCardSet(data)
        closeCardSetsList()
      } catch(error) {
        console.log(error)
      }
    }
  }

  const removeCardSet = async () => {
    try {
      await deleteCardSet(selectedTableRow.id)
      cardSetsDispatch({
        type: 'DELETE_CARD_SET',
        payload: selectedTableRow
      })
    } catch(error) {
      const header = 'Was unable to delete the card set'
      const message= 'Something went wrong'
      showNotification(<Notification header={header} message={message} />)
      console.log(error)
    }
  }

  const checkIfActive = () => {
    return selectedTableRow !== undefined
  }

  return(
    <CardSetsContainer>
      <CardSetsTable
        selectThisTableRow={selectThisTableRow}
        selectedTableRow={selectedTableRow}
      />
      <ButtonGroup>
        <SubWindowNavigationButton
          text='Open'
          onClick={openSelectedCardSet}
          isActive={checkIfActive()}
          isActivePassive={true}
        />
        <SubWindowNavigationButton
          text='Delete'
          onClick={removeCardSet}
          isActive={checkIfActive()}
          isActivePassive={true}
        />
        <SubWindowNavigationButton text='Close' onClick={closeCardSetsList} />
      </ButtonGroup>
    </CardSetsContainer>
  )
}

export default CardSetsList