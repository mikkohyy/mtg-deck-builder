import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { LoggedInUserContext } from '../../contexts/loggedInUserContext'
import { useContext } from 'react'
import ButtonGroup from '../Generic/ButtonGroup'

const Container = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox};
  align-items: center;
  gap: 1em;
  padding-top: 2em;
`

const StyledText = styled.span`
  font-size: 1.5em;  
`

const StyledLink = styled(Link)`
  ${props => props.theme.components.buttons.mainWindowLink.active};
  :hover {
    ${props => props.theme.components.buttons.mainWindowLink.hovered};
  };
`

const ViewWhenLoggedIn = () => {
  const { username } = useContext(LoggedInUserContext)

  return(
    <Container>
      <StyledText>
        Logged in as {username}
      </StyledText>
      <ButtonGroup>
        <StyledLink to='/builder'>Go to builder</StyledLink>
        <StyledLink to='/tester'>Go to tester</StyledLink>
      </ButtonGroup>
    </Container>
  )
}

export default ViewWhenLoggedIn