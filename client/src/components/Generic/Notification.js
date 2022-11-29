import styled from 'styled-components'
import { useContext } from 'react'
import { notificationContext } from '../../contexts/notificationContext'

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BoldText = styled.span`
  font-weight: bold;
`

const DefaultControls = () => {
  const { resetNotification } = useContext(notificationContext)

  return(
    <button onClick={resetNotification}>OK</button>
  )
}

const Notification = ({ header, message, customControls }) => {
  return(
    <NotificationContainer>
      { header === undefined
        ? <BoldText>Something went wrong</BoldText>
        : <BoldText>{header}</BoldText>
      }
      { message === undefined
        ? null
        : <p>{message}</p>
      }
      { customControls === undefined
        ? <DefaultControls />
        : <div>{customControls}</div>
      }
    </NotificationContainer>
  )
}

export default Notification