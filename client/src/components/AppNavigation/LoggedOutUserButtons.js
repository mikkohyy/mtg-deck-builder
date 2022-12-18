import ButtonGroup from '../Generic/ButtonGroup'
import AppNavigationButton from './AppNavigationButton'

const LoggedOutUserButtons = () => {
  return(
    <ButtonGroup>
      <AppNavigationButton text='Login' linkTo='/login' />
      <AppNavigationButton text='Sign up' linkTo='/' />
    </ButtonGroup>
  )
}

export default LoggedOutUserButtons