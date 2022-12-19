import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FrontPageContainer = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox};
  padding: ${props => props.theme.paddings.inMainView};
  gap: 0.5em;
`

const ButtonContainer = styled.div`
  ${props => props.theme.components.containers.horizontalButtonContainer};
`

const StyledLink = styled(Link)`
  ${props => props.theme.components.buttons.mainWindowLink.active};
  :hover {
    ${props => props.theme.components.buttons.mainWindowLink.hovered}
  };
`

const StyledHeader = styled.h1`
  margin-bottom: 0;
`

const FrontPage = () => {
  return(
    <FrontPageContainer>
      <StyledHeader>Welcome to the Magic the Gathering deck building app</StyledHeader>
      <p>Without login or signing up in or you just can explore the program.</p>
      <ButtonContainer>
        <StyledLink to='/login'>Press here to login</StyledLink>
        <StyledLink to='/signup'>Press here to sign up</StyledLink>
      </ButtonContainer>
    </FrontPageContainer>
  )
}

export default FrontPage