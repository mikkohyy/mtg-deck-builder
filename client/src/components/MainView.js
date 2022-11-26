import styled from 'styled-components'
import DeckBuildingView from './DeckBuilder/DeckBuildingView'
import { useContext } from 'react'
import { notificationMessageContext } from '../contexts/notificationMessageContext'
import ErrorMessage from './Generic/ErrorMessage'
import AppNavigation from './AppNavigation'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import DeckTester from './DeckTester'
import Login from './Login'

const MainContainer = styled.div`
  width: 95%;
  height: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: solid 3px lightgrey;
`

const MainView = () => {
  const { notificationIsVisible } = useContext(notificationMessageContext)

  return(
    <Router>
      <MainContainer>
        { notificationIsVisible === false
          ? null
          : <ErrorMessage />
        }
        <AppNavigation />
        <Routes>
          <Route path='/builder' element={<DeckBuildingView />} />
          <Route path='/tester' element={<DeckTester />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </MainContainer>
    </Router>
  )
}

export default MainView