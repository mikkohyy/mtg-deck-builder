// import { useState } from 'react'
import styled from 'styled-components'
import SelectInput from '../../../Generic/SelectInput'

const ChooseFieldsContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
  gap: 0.5em;
`

const ChooseFieldsPage = ({ newCardSetState, newCardSetDispatch }) => {
  const setFieldName = (field, name) => {
    newCardSetDispatch({
      type: 'SET_FIELD_NAME',
      payload: {
        field: field,
        name: name
      }
    })
  }

  const getFieldName = (field) => {
    const keyName = newCardSetState.fieldNames[field]
    return keyName
  }

  return(
    <ChooseFieldsContainer>
      <h3>Choose correspoding fields from the data</h3>
      <SelectInput
        choices={newCardSetState.keyNames}
        label={'Key with card name'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'name'}
      />
      <SelectInput
        choices={newCardSetState.keyNames}
        label={'Key with card price'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'price'}
      />
      <SelectInput
        choices={newCardSetState.keyNames}
        label={'Key with rarity'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'rarity'}
      />
      <SelectInput
        choices={newCardSetState.keyNames}
        label={'Key with card number'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'cardNumber'}
      />
      <SelectInput
        choices={newCardSetState.keyNames}
        label={'Key with mana cost'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'manaCost'}
      />
      <SelectInput
        choices={newCardSetState.keyNames}
        label={'Key with rules text'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'rulesText'}
      />
    </ChooseFieldsContainer>
  )
}

export default ChooseFieldsPage