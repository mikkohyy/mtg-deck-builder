import styled from 'styled-components'
import { LoggedInUserContext } from '../../contexts/loggedInUserContext'
import { useContext } from 'react'
import ButtonGroup from '../Generic/ButtonGroup'
import AppNavigationButton from './AppNavigationButton'

const TextContainer  = styled.div`
  display: flex;
  align-items: center;
`

const LoggedInUserElement = () => {
  const { logOutUser, username } = useContext(LoggedInUserContext)

  const handleLogOut = () => {
    logOutUser()
  }

  return(
    <ButtonGroup>
      <TextContainer>Logged in as {username}</TextContainer>
      <AppNavigationButton text='Log out' linkTo='/' onClick={handleLogOut}/>
    </ButtonGroup>
  )

}

export default LoggedInUserElement