import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: dotted 2px blue;
`

const DeckBuilderButtonRow = ({ openCardSets, toggleAddCardSet }) => {
  return(
    <ButtonContainer>
      <div>
        <button onClick={openCardSets}>Open card set</button>
        <button onClick={toggleAddCardSet}>Add card set</button>
        <button>Edit card set</button>
      </div>
      <div>
        <button>Save deck</button>
        <button>Open deck</button>
      </div>
    </ButtonContainer>
  )
}

export default DeckBuilderButtonRow