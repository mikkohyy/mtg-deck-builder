import styled from 'styled-components'

const StyledInput = styled.input`
  ${props => props.theme.components.inputs.mainWindow.text};
`

const LabelAndInput = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox};
  margin-top: 0.5em;
  gap: 0.5em;
`

const MainWindowInput = ({ name, type, label, value, setValue, maxLength }) => {
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return(
    <LabelAndInput>
      <label htmlFor={name}>{label}</label>
      <StyledInput
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
      />
    </LabelAndInput>
  )
}

export default MainWindowInput