import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  ${props => props.theme.components.buttons.appNavigation.basic};
  :hover {
    ${props => props.theme.components.buttons.appNavigation.hovered}
  }
`

const AppNavigationButton = ({ text, linkTo }) => {
  return(
    <StyledLink to={linkTo}>
      {text}
    </StyledLink>
  )
}

export default AppNavigationButton