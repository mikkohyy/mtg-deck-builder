import styled from  'styled-components'
import CardLibrary from './CardLibraryView/CardLibrary'
import DeckInformation from '../DeckInformation'
import DeckTable from '../DeckTable'

const DeckBuilderContainer = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  border: solid 2px red;
`

const DeckBuilder = () => {
  return(
    <DeckBuilderContainer>
      <CardLibrary />
      <DeckInformation />
      <DeckTable />
    </DeckBuilderContainer>
  )
}

export default DeckBuilder