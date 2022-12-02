import styled from 'styled-components'

const StyledButton = styled.button`
  ${props => props.theme.components.buttons.functionalityNavigation.basic};
  :hover {
    ${props => props.theme.components.buttons.functionalityNavigation.hovered};
  }
`

const FunctionalityNavButton = ({ text, onClick }) => {
  return(
    <StyledButton onClick={onClick}>
      {text}
    </StyledButton>
  )
}

export default FunctionalityNavButton