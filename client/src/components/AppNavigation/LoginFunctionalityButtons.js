import { LoggedInUserContext } from '../../contexts/loggedInUserContext'
import { useContext } from 'react'
import LoggedInUserElement from './LoggedInUserElement'
import LoggedOutUserButtons from './LoggedOutUserButtons'

const LoginFunctionalityButtons = () => {
  const { isUserLoggedIn } = useContext(LoggedInUserContext)
  return(
    isUserLoggedIn() === true
      ? <LoggedInUserElement />
      : <LoggedOutUserButtons />
  )
}

export default LoginFunctionalityButtons