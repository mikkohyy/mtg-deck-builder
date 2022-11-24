import styled from 'styled-components'
import CardSetsList from '../CardSetSelectionView/CardSetsList'
import DeckBuilder from './DeckBuilder'
import DeckBuilderButtonRow from './DeckBuilderButtonRow'
import useCardSetsSelection from '../../hooks/useCardSetsSelection'
import AddCardSetView from './AddCardSetView/AddCardSetWindow'
import { useState } from 'react'

const DeckBuildingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const DeckBuildingView = () => {
  const [addCardSetViewIsVisible, setAddCardSetViewIsVisible] = useState(false)

  const {
    cardSetIsOpen,
    cardSetsList,
    clickOpenCardSets,
    setCardSetIsOpen
  } = useCardSetsSelection()

  const openCardSetList = async () => {
    clickOpenCardSets()
  }

  const toggleAddCardSet = () => {
    setAddCardSetViewIsVisible(!addCardSetViewIsVisible)
  }

  return(
    <DeckBuildingContainer>
      { cardSetIsOpen === true
        ? <CardSetsList
          cardSets={cardSetsList}
          setCardSetIsOpen={setCardSetIsOpen}
        />
        : null
      }

      { addCardSetViewIsVisible === true
        ? <AddCardSetView toggleAddCardSet={toggleAddCardSet} />
        : null
      }

      <DeckBuilderButtonRow
        openCardSets={openCardSetList}
        toggleAddCardSet={toggleAddCardSet}
      />
      <DeckBuilder />
    </DeckBuildingContainer>
  )
}

export default DeckBuildingView