import styled from 'styled-components'

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr;
`
const BoldText = styled.span`
  font-weight: bold;
`

const CardLibraryHeader = () => {
  return(
    <Row>
      <BoldText>Name</BoldText>
      <BoldText>Mana cost</BoldText>
      <BoldText>Price</BoldText>
    </Row>
  )
}

export default CardLibraryHeader