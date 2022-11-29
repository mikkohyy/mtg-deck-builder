import styled from 'styled-components'

const StyledButton = styled.button`
  ${props => props.theme.components.buttons.secondary.active};
  :hover {
    ${props => props.theme.components.buttons.hovered}
  }
`

const BasicButton = ({ text, onClick }) => {
  return(
    <StyledButton onClick={onClick}>{text}</StyledButton>
  )
}

export default BasicButton