import styled from 'styled-components'
import CardSetsList from './CardSetSelectionView/CardSetsList'
import DeckBuilder from './DeckBuilder'
import DeckBuilderButtonRow from './DeckBuilderButtonRow'
import useCardSetsSelection from '../hooks/useCardSetsSelection'

const DeckBuildingContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const DeckBuildingView = () => {
  const {
    isOpen,
    cardSetsList,
    clickOpenCardSets,
    setIsOpen
  } = useCardSetsSelection()

  const openCardSetList = async () => {
    clickOpenCardSets()
  }

  return(
    <div>
      { isOpen === true
        ? <CardSetsList
          cardSets={cardSetsList}
          setIsOpen={setIsOpen}
        />
        : null}
      <DeckBuildingContainer>
        <DeckBuilderButtonRow openCardSets={openCardSetList}/>
        <DeckBuilder />
      </DeckBuildingContainer>
    </div>
  )
}

export default DeckBuildingView