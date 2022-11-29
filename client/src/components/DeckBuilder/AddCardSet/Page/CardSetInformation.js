import styled from 'styled-components'

const InformationContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
  gap: 0.3em;
`

const GuidingText = styled.span`
  ${props => props.theme.components.text.guidingText}
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3em;
`

const DescriptionTextArea = styled.textarea`
  resize: none;
`

const CardSetInformationPage = ({
  newCardSetState,
  newCardSetDispatch
}) => {
  const handleDeckNameChange = (event) => {
    newCardSetDispatch({
      type: 'SET_NAME',
      payload: event.target.value
    })
  }

  const handleDescriptionChange = (event) => {
    newCardSetDispatch({
      type: 'SET_DESCRIPTION',
      payload: event.target.value
    })
  }

  return(
    <InformationContainer>
      <h3>Card set information</h3>
      <InputContainer>
        <label htmlFor={'nameInput'}>Name: </label>
        <input
          type={'text'}
          value={newCardSetState.name}
          onChange={handleDeckNameChange}
          maxLength={50}
          id={'nameInput'}
        />
      </InputContainer>
      <InputContainer>
        <label htmlFor={'descriptionTextArea'}>Description: </label>
        <DescriptionTextArea
          value={newCardSetState.description}
          onChange={handleDescriptionChange}
          cols={30}
          rows={10}
          id={'descriptionTextArea'}
        />
      </InputContainer>
      <em>
        <GuidingText>
          Both fields are required
        </GuidingText>
      </em>
    </InformationContainer>
  )
}

export default CardSetInformationPage