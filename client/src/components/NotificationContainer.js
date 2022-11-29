import styled from 'styled-components'
import { useContext } from 'react'
import { notificationContext } from '../contexts/notificationContext'

const ErrorContainer = styled.div`
  max-width: 30em;  
  z-index: 2;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.basicPalette.light};
  border: solid 2px ${props => props.theme.basicPalette.dark}; 
  border-radius: ${props => props.theme.boxProperties.corners};
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const NotificationContainer = () => {
  const { notification } = useContext(notificationContext)

  return(
    <ErrorContainer>
      {notification}
    </ErrorContainer>
  )
}

export default NotificationContainer