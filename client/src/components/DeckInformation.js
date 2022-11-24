import styled from 'styled-components'

const DeckInformationContainer = styled.div`
  align-items: start;
  border: solid 2px blue;
`

const InnerDiv = styled.div`
`

const SetCardsTable = () => {
  return(
    <DeckInformationContainer>
      <InnerDiv>
        Deck information
      </InnerDiv>
    </DeckInformationContainer>
  )
}

export default SetCardsTable
