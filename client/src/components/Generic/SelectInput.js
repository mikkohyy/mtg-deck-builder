import styled from 'styled-components'

const InputContainer = styled.div`
display: flex;
flex: 0;
gap: 0.5em;
`

const SelectInput = ({ choices, label, getFieldName, setFieldName, fieldName }) => {
  const handleChange = (event) => {
    setFieldName(fieldName, event.target.value)
  }

  return(
    <InputContainer>
      <label htmlFor={`${label}-select`}>{label}</label>
      <select value={getFieldName(fieldName)} id={`${label}-select`} onChange={handleChange}>
        <option value={''}>Choose field</option>
        { choices.map(choice => {
          return(
            <option key={`${choice}-${fieldName}`} value={choice}>
              {choice}
            </option>
          )
        })}
      </select>
    </InputContainer  >
  )
}

export default SelectInput