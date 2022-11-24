import styled from 'styled-components'
import ViewButtonRow from './ViewButtonRow'
import DeckBuildingView from './DeckBuilder/DeckBuildingView'
import { useContext } from 'react'
import { notificationMessageContext } from '../contexts/notificationMessageContext'
import ErrorMessage from './Generic/ErrorMessage'

const MainContainer = styled.div`
  width: 95%;
  height: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: solid 3px black;
`

const ControlsRow = styled.div`
  display: flex;  
  justify-content: space-between;
  border: dotted 2px black;
`

const MainView = () => {
  const { notificationIsVisible } = useContext(notificationMessageContext)

  return(
    <MainContainer>
      { notificationIsVisible === false
        ? null
        : <ErrorMessage />
      }
      <ControlsRow>
        <ViewButtonRow />
        <button>Logout button</button>
      </ControlsRow>
      <DeckBuildingView />
    </MainContainer>
  )
}

export default MainView