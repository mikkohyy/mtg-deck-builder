import { MainView, ControlsRow } from './components/FlexComponents'
import ViewButtonRow from './components/ViewButtonRow'
import DeckBuildingView from './components/DeckBuildingView'
import { CardSetProvider } from './contexts/cardSetContext'

const App = () => {
  return(
    <CardSetProvider>
      <MainView>
        <ControlsRow>
          <ViewButtonRow />
          <button>Logout button</button>
        </ControlsRow>
        <DeckBuildingView />
      </MainView>
    </CardSetProvider>
  )
}

export default App
