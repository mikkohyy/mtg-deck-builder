import AppNavigationButton from './AppNavigationButton'
import ButtonGroup from '../Generic/ButtonGroup'

const FunctionalitySelection = () => {
  return(
    <ButtonGroup>
      <AppNavigationButton text='Builder' linkTo='/builder' />
      <AppNavigationButton text='Tester' linkTo='/tester' />
    </ButtonGroup>
  )
}

export default FunctionalitySelection