import styled from 'styled-components'
import { useContext } from 'react'
import { notificationContext } from '../contexts/notificationContext'

const NofiticationContainer = styled.div`
  ${props => props.theme.components.containers.notificationContainer}
`

const NotificationContainer = () => {
  const { notification } = useContext(notificationContext)

  return(
    <NofiticationContainer>
      {notification}
    </NofiticationContainer>
  )
}

export default NotificationContainer