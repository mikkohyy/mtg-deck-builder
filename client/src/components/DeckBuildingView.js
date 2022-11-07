import styled from 'styled-components'
import CardSetsList from './CardSetsList'
import DeckBuilder from './DeckBuilder'
import DeckBuilderButtonRow from './DeckBuilderButtonRow'
import cardSetServices from '../services/card_sets'
import { useState } from 'react'

const DeckBuildingContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const DeckBuildingView = () => {
  const [ cardSets, setCardSets ] = useState([])
  const [ cardSetsIsOpen, setCardSetsIsOpen ] = useState(false)

  const openCardSetList = async () => {
    const foundCardSets = await cardSetServices.getAllCardSets()
    setCardSets(foundCardSets)
    setCardSetsIsOpen(!cardSetsIsOpen)
  }

  return(
    <div>
      { cardSetsIsOpen ? <CardSetsList cardSets={cardSets} /> : null }
      <DeckBuildingContainer>
        <DeckBuilderButtonRow openCardSets={openCardSetList}/>
        <DeckBuilder />
      </DeckBuildingContainer>
    </div>
  )
}

export default DeckBuildingView