import styled from 'styled-components'

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledLabel = styled.label`
  font-size: 0.9em;
`

const StyledCheckbox = styled.input`
  height: 0.9em;
  width: 0.9em;
`

const CheckBox = ({ name, type, label, checked, handleChange }) => {

  return(
    <CheckBoxContainer>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledCheckbox
        type='checkbox'
        name={name}
        id={name}
        checked={checked}
        onChange={() => handleChange(type)}
      />
    </CheckBoxContainer>
  )
}

export default CheckBox