import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  ${props => props.theme.components.buttons.appNavigation.basic};
  :hover {
    ${props => props.theme.components.buttons.appNavigation.hovered}
  }
`

const AppNavigationButton = ({ text, linkTo, onClick = undefined }) => {
  if (onClick !== undefined) {
    return(
      <StyledLink to={linkTo} onClick={onClick}>
        {text}
      </StyledLink>
    )
  } else {
    return(
      <StyledLink to={linkTo}>
        {text}
      </StyledLink>
    )
  }

}

export default AppNavigationButton