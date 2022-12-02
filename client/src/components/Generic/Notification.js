import styled from 'styled-components'
import { useContext } from 'react'
import { notificationContext } from '../../contexts/notificationContext'

const Container = styled.div`
  ${props => props.theme.components.containers.verticalFlexbox}
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
    <Container>
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
    </Container>
  )
}

export default Notification