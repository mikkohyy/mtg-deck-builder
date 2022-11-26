import styled from 'styled-components'
import FunctionalitySelectionButton from '../Generic/FunctionalitySelectionButton'
import FunctionalitySelection from './FunctionalitySelection'

const ControlsContainer = styled.div`
  display: flex;  
  justify-content: space-between;
  border: dotted 2px black;
`

const AppControls = () => {
  return(
    <ControlsContainer>
      <FunctionalitySelection />
      <FunctionalitySelectionButton text='Logout' linkTo='/' />
    </ControlsContainer>
  )
}

export default AppControls