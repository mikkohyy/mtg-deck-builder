import styled from 'styled-components'

const SummaryContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
  gap: 0.5em;
`

const BoldText = styled.span`
  font-weight: bold;
`

const InformationRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const OpenCardSetContainer = styled.div`
  fisplay: flex;
  padding: 0;
`

const SummaryPage = ({
  openCardSetAfterAddition,
  setOpenCardSetAfterAddition,
  newCardSetState,
}) => {
  return(
    <SummaryContainer>
      <h3>Summary of the card set</h3>
      <InformationRow>
        <div>
          <BoldText>Name:</BoldText>
        </div>
        <div>
          {newCardSetState.name}
        </div>
      </InformationRow>
      <InformationRow>
        <div>
          <BoldText>Description:</BoldText>
        </div>
        <div>
          {newCardSetState.description}
        </div>
      </InformationRow>
      <InformationRow>
        <div>
          <BoldText>
            Number of cards:
          </BoldText>
        </div>
        <div>
          { newCardSetState.cards.length }
        </div>
      </InformationRow>
      <OpenCardSetContainer>
        <input
          type='checkbox'
          checked={openCardSetAfterAddition}
          onChange={() => setOpenCardSetAfterAddition(!openCardSetAfterAddition)}
        />
        <label htmlFor='openSet'>Open the card set after adding</label>
      </OpenCardSetContainer>
    </SummaryContainer>
  )
}

export default SummaryPage