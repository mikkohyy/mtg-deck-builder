// import { useState } from 'react'
import styled from 'styled-components'
import SelectInput from '../../Generic/SelectInput'

const ChooseFieldsContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
  gap: 0.5em;
`

const ChooseFieldsPage = ({ cardKeyNames, setFieldName, getFieldName }) => {
  return(
    <ChooseFieldsContainer>
      <h3>Choose correspoding fields from the data</h3>
      <SelectInput
        choices={cardKeyNames}
        label={'Key with card name'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'name'}
      />
      <SelectInput
        choices={cardKeyNames}
        label={'Key with card price'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'price'}
      />
      <SelectInput
        choices={cardKeyNames}
        label={'Key with rarity'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'rarity'}
      />
      <SelectInput
        choices={cardKeyNames}
        label={'Key with card number'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'cardNumber'}
      />
      <SelectInput
        choices={cardKeyNames}
        label={'Key with mana cost'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'manaCost'}
      />
      <SelectInput
        choices={cardKeyNames}
        label={'Key with rules text'}
        getFieldName={getFieldName}
        setFieldName={setFieldName}
        fieldName={'rulesText'}
      />
    </ChooseFieldsContainer>
  )
}

export default ChooseFieldsPage