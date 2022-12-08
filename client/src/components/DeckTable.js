import styled from 'styled-components'

const DeckTableContainer = styled.div`
  align-items: start;
  border: solid 2px green;
  flex: 2 0 auto;
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