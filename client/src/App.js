import { OpenedCardSetProvider } from './contexts/openedCardSetContext'
import { CardSetsProvider } from './contexts/cardSetsContext'
import { NotificationProvider } from './contexts/notificationContext'
import { ThemeProvider } from 'styled-components'
import { OpenedDeckProvider } from './contexts/openedDeckContext'
import theme from './theme'
import MainContainer from './components/MainContainer'

const App = () => {
  return(
    <ThemeProvider theme={theme}>
      <CardSetsProvider>
        <OpenedCardSetProvider>
          <NotificationProvider>
            <OpenedDeckProvider>
              <MainContainer />
            </OpenedDeckProvider>
          </NotificationProvider>
        </OpenedCardSetProvider>
      </CardSetsProvider>
    </ThemeProvider>
  )
}

export default App