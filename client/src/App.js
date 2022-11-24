import { CardSetProvider } from './contexts/cardSetContext'
import { NotificationMessageProvider } from './contexts/notificationMessageContext'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import MainView from './components/MainView'

const App = () => {
  return(
    <ThemeProvider theme={theme}>
      <CardSetProvider>
        <NotificationMessageProvider>
          <MainView />
        </NotificationMessageProvider>
      </CardSetProvider>
    </ThemeProvider>
  )
}

export default App