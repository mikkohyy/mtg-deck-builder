import styled from 'styled-components'
import CardSetsList from './CardSetsList'
import LibraryInformationAndDeckContainer from './LibraryInformationAndDeckContainer'
import DeckBuilderButtonRow from './DeckBuilderButtonRow'
import AddCardSet from './AddCardSet'
import { useState, useContext } from 'react'
import { CardSetsContext } from '../../contexts/cardSetsContext'

const DeckBuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const DeckBuilder = () => {
  const [cardSetsListIsOpen, setCardSetsListIsOpen] = useState(false)
  const [addCardSetIsOpen, setAddCardSetIsOpen] = useState(false)
  const { cardSetsDispatch } = useContext(CardSetsContext)

  const openCardSetList = async () => {
    setCardSetsListIsOpen(true)
  }

  const toggleAddCardSet = () => {
    setAddCardSetIsOpen(!addCardSetIsOpen)
  }

  return(
    <DeckBuilderContainer>
      { cardSetsListIsOpen === true
        ? <CardSetsList setCardSetsListIsOpen={setCardSetsListIsOpen} />
        : null
      }

      { addCardSetIsOpen === true
        ? <AddCardSet
          toggleAddCardSet={toggleAddCardSet}
          cardSetsDispatch={cardSetsDispatch}
        />
        : null
      }

      <DeckBuilderButtonRow
        openCardSets={openCardSetList}
        toggleAddCardSet={toggleAddCardSet}
      />
      <LibraryInformationAndDeckContainer />
    </DeckBuilderContainer>
  )
}

export default DeckBuilder