import styled from  'styled-components'
import CardLibrary from './CardLibraryView/CardLibrary'
import DeckInformation from '../DeckInformation'
import DeckTable from '../DeckTable'

const DeckBuilderCompartments = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  border: solid 2px red;
`

const LibraryInformationAndDeckContainer = () => {
  return(
    <DeckBuilderCompartments>
      <CardLibrary />
      <DeckInformation />
      <DeckTable />
    </DeckBuilderCompartments>
  )
}

export default LibraryInformationAndDeckContainer