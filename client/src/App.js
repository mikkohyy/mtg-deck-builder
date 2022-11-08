import { MainView, ControlsRow } from './components/FlexComponents'
import ViewButtonRow from './components/ViewButtonRow'
import DeckBuildingView from './components/DeckBuildingView'


const App = () => {
  return(
    <MainView>
      <ControlsRow>
        <ViewButtonRow />
        <button>Logout button</button>
      </ControlsRow>
      <DeckBuildingView />
    </MainView>
  )
}

export default App
