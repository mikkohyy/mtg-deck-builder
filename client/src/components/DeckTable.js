import styled from 'styled-components'

const DeckTableContainer = styled.div`
  align-items: start;
  border: solid 2px green;
`

const InnerDiv = styled.div`
`

const DeckTable = () => {
  return(
    <DeckTableContainer>
      <InnerDiv>
        Deck table
      </InnerDiv>
    </DeckTableContainer>
  )
}

export default DeckTable