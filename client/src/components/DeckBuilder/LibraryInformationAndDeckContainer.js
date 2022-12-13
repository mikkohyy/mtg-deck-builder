import styled from  'styled-components'
import CardLibrary from './CardLibrary'
import DeckInformation from '../DeckInformation'
import DeckTable from './DeckTable'

const DeckBuilderCompartments = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: ${props => props.theme.paddings.inMainView};
  flex: 1 0 auto;
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