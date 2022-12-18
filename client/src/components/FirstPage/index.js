import styled from 'styled-components'

const FrontPageContainer = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox};
  padding: ${props => props.theme.paddings.inMainView};
  gap: 0.5em;
`

const ButtonContainer = styled.div`
  ${props => props.theme.components.containers.horizontalButtonContainer};
`

const StyledButton = styled.button`
  ${props => props.theme.components.buttons.subWindow.active};
  :hover {
    ${props => props.theme.components.buttons.subWindow.hovered}
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
        <StyledButton>Press here to login</StyledButton>
        <StyledButton>Press here to sign up</StyledButton>
      </ButtonContainer>
    </FrontPageContainer>
  )
}

export default FrontPage