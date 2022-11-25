import styled from 'styled-components'
import CardSetsList from './CardSetSelectionView/CardSetsList'
import DeckBuilder from './DeckBuilder'
import DeckBuilderButtonRow from './DeckBuilderButtonRow'
import useCardSetsSelection from '../../hooks/useCardSetsSelection'
import AddCardSetWindow from './AddCardSetView/AddCardSetWindow'
import { useState, useEffect } from 'react'
import { getAllCardSets } from '../../services/card_sets'

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
    dispatchCardSetsList,
    clickOpenCardSets,
    setCardSetIsOpen,
    toggleOpenCardSetActivity
  } = useCardSetsSelection()

  useEffect(() => {
    const getCardSets = async () => {
      try {
        const foundCardSets = await getAllCardSets()
        dispatchCardSetsList({
          type: 'SET_CARD_SET_LIST',
          payload: foundCardSets
        })
      } catch(error) {
        console.log(error)
      }
    }
    getCardSets()
  }, [])

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
          toggleOpenCardSetActivity={toggleOpenCardSetActivity}
          dispatchCardSetsList={dispatchCardSetsList}
        />
        : null
      }

      { addCardSetViewIsVisible === true
        ? <AddCardSetWindow
          toggleAddCardSet={toggleAddCardSet}
          dispatchCardSetsList={dispatchCardSetsList}
        />
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