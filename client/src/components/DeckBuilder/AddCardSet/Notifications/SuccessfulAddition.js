import { useContext } from 'react'
import { notificationContext } from '../../../../contexts/notificationContext'
import Notification from '../../../Generic/Notification'

const SuccessfulAddition = ({ toggleAddCardSet }) => {
  const header = 'Addition was successful'
  const message = 'Time to start building decks!'
  const { resetNotification } = useContext(notificationContext)

  const customOnClick = () => {
    toggleAddCardSet()
    resetNotification()
  }

  return(
    <Notification
      header={header}
      message={message}
      customControls={<button onClick={customOnClick}>OK</button>}
    />
  )
}

export default SuccessfulAddition