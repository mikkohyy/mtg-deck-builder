import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox};
  gap: 1em;
`

const StyledText = styled.span`
  font-size: 1.2em;
`

const StyledLink = styled(Link)`
  ${props => props.theme.components.buttons.mainWindowLink.active};
  :hover {
    ${props => props.theme.components.buttons.mainWindowLink.hovered}
  };
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const CreatedNewUserView = ({ createdUser }) => {
  return(
    <Container>
      <StyledText>
        Created new user with the username {createdUser.username}
      </StyledText>
      <ButtonContainer>
        <StyledLink to='/login'>
        Go to login
        </StyledLink>
      </ButtonContainer>
    </Container>
  )
}

export default CreatedNewUserView