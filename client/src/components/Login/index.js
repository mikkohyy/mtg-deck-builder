import ViewWhenLoggedIn from './ViewWhenLoggedIn'
import ViewWhenNotLoggedIn from './ViewWhenNotLoggedIn'
import { useContext } from 'react'
import styled from 'styled-components'
import { LoggedInUserContext } from '../../contexts/loggedInUserContext'

const LoginContainer = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox};
  padding: ${props => props.theme.paddings.inMainView};
  align-items: center;
`

const Login = () => {
  const { isUserLoggedIn } = useContext(LoggedInUserContext)

  return(
    <LoginContainer>
      {isUserLoggedIn() === true
        ? <ViewWhenLoggedIn />
        : <ViewWhenNotLoggedIn />
      }
    </LoginContainer>
  )
}

export default Login