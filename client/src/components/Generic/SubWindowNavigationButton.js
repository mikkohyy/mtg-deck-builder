import styled from 'styled-components'

const StyledButton = styled.button`
  ${props => props.active === true
    ? props.theme.components.buttons.subWindow.active
    : props.theme.components.buttons.subWindow.passive}
  ${props => props.active === true
    ? { ':hover': props.theme.components.buttons.subWindow.hovered }
    : undefined}
`

const SubWindowNavigationButton = ({ text, onClick, isActivePassive = false, isActive }) => {
  const active = isActive === false && isActivePassive === true ? false : true

  return(
    <StyledButton onClick={onClick} active={active}>
      {text}
    </StyledButton>
  )
}

export default SubWindowNavigationButton