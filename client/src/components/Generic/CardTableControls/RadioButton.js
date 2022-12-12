import styled from 'styled-components'

const RadioButtonContainer = styled.div`
  display: flex;
  gap: 0.25em;
`

const StyledLabel = styled.label`
  font-size: 0.9em;
`

const StyledRadioButton = styled.input`
  height: 0.9em;
  width: 0.9em;
  margin: auto;
`

const RadioButton = ({ label, onChange, name, checked }) => {
  return(
    <RadioButtonContainer>
      <StyledRadioButton
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        id={name}
      />
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
    </RadioButtonContainer>
  )
}

export default RadioButton