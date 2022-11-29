import styled from 'styled-components'
import BasicButton from '../Generic/BasicButton'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border: dotted 2px blue;
`

const GappedDiv = styled.div`
  display: flex;
  gap: ${props => props.theme.components.buttons.gapBetween};
`

const DeckBuilderButtonRow = ({ openCardSets, toggleAddCardSet }) => {
  return(
    <ButtonContainer>
      <GappedDiv>
        <BasicButton text='Open card set' onClick={openCardSets} />
        <BasicButton text='Add card set' onClick={toggleAddCardSet} />
        <BasicButton text='Edit card set' />
      </GappedDiv>
      <GappedDiv>
        <BasicButton text='Save deck' />
        <BasicButton text='Open deck' />
      </GappedDiv>
    </ButtonContainer>
  )
}

export default DeckBuilderButtonRow