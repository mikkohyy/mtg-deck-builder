import styled from  'styled-components'
import SetCardsTable from './CardLibraryView/CardLibraryTable'
import DeckInformation from './DeckInformation'
import DeckTable from './DeckTable'

const DeckBuilderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const DeckBuilder = () => {
  return(
    <DeckBuilderContainer>
      <SetCardsTable />
      <DeckInformation />
      <DeckTable />
    </DeckBuilderContainer>
  )
}

export default DeckBuilder