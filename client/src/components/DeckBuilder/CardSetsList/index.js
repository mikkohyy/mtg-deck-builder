import useCardSetsRowSelection from '../../../hooks/useCardSetRowSelection'
import CardSetsTable from './CardSetsTable'
import styled from 'styled-components'
import { getCardSetWithId, deleteCardSet } from '../../../services/card_sets'
import { useContext } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import { CardSetsContext } from '../../../contexts/cardSetsContext'
import { notificationContext } from '../../../contexts/notificationContext'
import ButtonGroup from '../../Generic/ButtonGroup'
import SubWindowNavigationButton from '../../Generic/SubWindowNavigationButton'
import CardSetDeletionError from './Notifications/CardSetDeletionError'

const CardSetsContainer = styled.div`
  ${props => props.theme.components.containers.subWindow}
`

const CardSetsList = ({ setSelectCardSetIsOpen, setActiveSubWindow }) => {
  const { selectThisCardSetRow, selectedCardSet } = useCardSetsRowSelection()
  const { setOpenedCardSet } = useContext(OpenedCardSetContext)
  const { showNotification } = useContext(notificationContext)
  const { cardSetsDispatch } = useContext(CardSetsContext)

  const closeCardSetsList = () => {
    setSelectCardSetIsOpen(false)
    setActiveSubWindow(undefined)
  }

  const openSelectedCardSet = async() => {
    if (selectedCardSet !== undefined) {
      try {
        const cardSetId = selectedCardSet.id
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
      await deleteCardSet(selectedCardSet.id)
      cardSetsDispatch({
        type: 'DELETE_CARD_SET',
        payload: selectedCardSet
      })
    } catch(error) {
      showNotification(CardSetDeletionError)
      console.log(error)
    }
  }

  const checkIfActive = () => {
    return selectedCardSet !== undefined
  }

  return(
    <CardSetsContainer>
      <CardSetsTable
        selectThisCardSetRow={selectThisCardSetRow}
        selectedCardSet={selectedCardSet}
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