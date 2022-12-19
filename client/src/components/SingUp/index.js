import styled from 'styled-components'
import { useContext } from 'react'
import { LoggedInUserContext } from '../../contexts/loggedInUserContext'
import ViewWhenLoggedIn from './ViewWhenLoggedIn'
import ViewWhenNotLoggedIn from './ViewWhenNotLoggedIn'

const Container = styled.div`  
  ${props => props.theme.components.containers.mainWindow.withCenteredItems};
`

const SignUp = () => {
  const { isUserLoggedIn } = useContext(LoggedInUserContext)
  return(
    <Container>
      { isUserLoggedIn() === true
        ? <ViewWhenLoggedIn />
        : <ViewWhenNotLoggedIn />
      }
    </Container>
  )
}

export default SignUp