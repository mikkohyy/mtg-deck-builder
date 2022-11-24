import styled from 'styled-components'
import { useContext } from 'react'
import { notificationMessageContext } from '../../contexts/notificationMessageContext'

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

const ErrorText = styled.div`
  margin-bottom: 0.6em;
`

const OkButton = styled.button`
  align-self: center;
`

const ErrorMessage = () => {
  const {
    notificationMessage,
    resetNotificationMessage
  } = useContext(notificationMessageContext)

  return(
    <ErrorContainer>
      <ErrorText>
        {notificationMessage}
      </ErrorText>
      <OkButton onClick={resetNotificationMessage}>OK</OkButton>
    </ErrorContainer>
  )
}

export default ErrorMessage