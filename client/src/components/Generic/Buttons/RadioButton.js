import styled from 'styled-components'

const RadioButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledLabel = styled.label`
  font-size: 0.9em;
`

const StyledInput = styled.input`
  height: 0.9em;
  width: 0.9em;
`

const RadioButton = ({ label, onChange, name, checked }) => {
  return(
    <RadioButtonContainer>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledInput
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        id={name}
      />
    </RadioButtonContainer>
  )
}

export default RadioButton