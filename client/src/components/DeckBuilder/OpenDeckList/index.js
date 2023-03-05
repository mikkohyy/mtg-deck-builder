import { useContext } from 'react'
import { OpenedDeckContext } from '../../../contexts/openedDeckContext'
import { LoggedInUserContext } from '../../../contexts/loggedInUserContext'
import useTableRowSelection from '../../../hooks/useTableRowSelection'
import styled from 'styled-components'
import SubWindowNavigationButton from '../../Generic/SubWindowNavigationButton'
import DeckListTable from './DeckListTable'
import { getDeckFromDatabase } from '../../../services/decks'
import { getCardsWithCardColorAndManaSymbols } from '../../../utils/card_property_utils'

const DeckTableContainer = styled.div`
  ${props => props.theme.components.containers.subWindow};
  right: ${props => props.theme.paddings.fromSides};
  gap: 0.3em;
`

const ButtonRow = styled.div`
  ${props => props.theme.components.containers.horizontalButtonContainer}
`

const OpenDeckList = ({ toggleOpenDeck }) => {
  const { selectThisTableRow, selectedTableRow } = useTableRowSelection()
  const { token } = useContext(LoggedInUserContext)
  const { setOpenedDeck } = useContext(OpenedDeckContext)

  const handleOpenDeck = async () => {
    try {
      const receivedData = await getDeckFromDatabase(token, selectedTableRow.id)
      const receivedDeck = receivedData.data
      const augmentedCards = getCardsWithCardColorAndManaSymbols(receivedDeck.cards)

      const deck = {
        ...receivedDeck,
        cards: [...augmentedCards]
      }

      setOpenedDeck(deck)
      toggleOpenDeck()
    } catch(error) {
      console.log(error)
    }
  }

  const handleCloseWindow = () => {
    toggleOpenDeck()
  }

  const checkIfActive = () => {
    return selectedTableRow !== undefined
  }

  return(
    <DeckTableContainer>
      <DeckListTable
        selectThisTableRow={selectThisTableRow}
        selectedTableRow={selectedTableRow}
      />
      <ButtonRow>
        <SubWindowNavigationButton
          text='Open'
          onClick={handleOpenDeck}
          isActive={checkIfActive()}
          isActivePassive={true}
        />
        <SubWindowNavigationButton text='Close' onClick={handleCloseWindow} />
      </ButtonRow>
    </DeckTableContainer>
  )
}

export default OpenDeckList