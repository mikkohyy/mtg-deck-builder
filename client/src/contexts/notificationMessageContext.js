import { createContext, useState } from 'react'

const notificationMessageContext = createContext(undefined)

const NotificationMessageProvider = ({ children }) => {
  const [notificationIsVisible, setNotificationIsVisible] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(undefined)

  const resetNotificationMessage = () => {
    setNotificationIsVisible(false)
    setNotificationMessage(undefined)
  }

  const showNotificationMessage = (message) => {
    setNotificationMessage(message)
    setNotificationIsVisible(true)
  }

  return(
    <notificationMessageContext.Provider
      value={{
        notificationIsVisible,
        setNotificationIsVisible,
        notificationMessage,
        setNotificationMessage,
        resetNotificationMessage,
        showNotificationMessage
      }}
    >
      {children}
    </notificationMessageContext.Provider>
  )
}

export { notificationMessageContext, NotificationMessageProvider }