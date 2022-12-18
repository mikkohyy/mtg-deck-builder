import styled from 'styled-components'
import FunctionalitySelectionButtons from './FunctionalitySelectionButtons'
import LoginFunctionalityButtons from './LoginFunctionalityButtons'

const AppControlsContainer = styled.div`
  display: flex;  
  justify-content: space-between;
  background: ${props => props.theme.basicPalette.dark};
  padding: ${props => props.theme.paddings.inMainView};
`

const AppNavigation = () => {
  return(
    <AppControlsContainer>
      <FunctionalitySelectionButtons />
      <LoginFunctionalityButtons />
    </AppControlsContainer>
  )
}

export default AppNavigation