import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  ${props => props.theme.components.buttons.primary};
  :hover {
    ${props => props.theme.components.buttons.hovered}
  }
`

const FunctionalitySelectionButton = ({ text, linkTo }) => {
  return(
    <StyledLink to={linkTo}>
      {text}
    </StyledLink>
  )
}

export default FunctionalitySelectionButton