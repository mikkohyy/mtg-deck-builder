import styled from 'styled-components'
import FunctionalitySelectionButton from '../Generic/FunctionalitySelectionButton'
import FunctionalitySelection from './FunctionalitySelection'

const AppControlsContainer = styled.div`
  display: flex;  
  justify-content: space-between;
  border: dotted 2px black;
`

const AppNavigation = () => {
  return(
    <AppControlsContainer>
      <FunctionalitySelection />
      <FunctionalitySelectionButton text='Logout' linkTo='/' />
    </AppControlsContainer>
  )
}

export default AppNavigation