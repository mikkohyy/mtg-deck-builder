import styled from 'styled-components'
import CardSetsList from './CardSetsList'
import DeckBuilder from './DeckBuilder'
import DeckBuilderButtonRow from './DeckBuilderButtonRow'
import useCardSetsSelection from '../hooks/useCardSetsSelection'

const DeckBuildingContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const DeckBuildingView = () => {
  const {
    openCardSetsIsActive,
    cardSetsList,
    clickOpenCardSets,
    changeOpenCardSetActivity
  } = useCardSetsSelection()

  const openCardSetList = async () => {
    clickOpenCardSets()
  }

  return(
    <div>
      { openCardSetsIsActive === true
        ? <CardSetsList
          cardSets={cardSetsList}
          changeActivity={changeOpenCardSetActivity}
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