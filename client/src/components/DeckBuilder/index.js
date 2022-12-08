import styled from 'styled-components'
import LibraryInformationAndDeckContainer from './LibraryInformationAndDeckContainer'
import NavigationBar from './NavigationBar'

const DeckBuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`

const DeckBuilder = () => {
  return(
    <DeckBuilderContainer>
      <NavigationBar />
      <LibraryInformationAndDeckContainer />
    </DeckBuilderContainer>
  )
}

export default DeckBuilder