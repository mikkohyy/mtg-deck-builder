import { createContext, useState } from 'react'

const notificationContext = createContext(undefined)

const NotificationProvider = ({ children }) => {
  const [notificationIsVisible, setNotificationIsVisible] = useState(false)
  const [notification, setNotification] = useState(undefined)

  const resetNotification = () => {
    setNotificationIsVisible(false)
    setNotification(undefined)
  }

  const showNotification = (component) => {
    setNotification(component)
    setNotificationIsVisible(true)
  }

  return(
    <notificationContext.Provider
      value={{
        notificationIsVisible,
        setNotificationIsVisible,
        notification,
        setNotification,
        resetNotification,
        showNotification
      }}
    >
      {children}
    </notificationContext.Provider>
  )
}

export { notificationContext, NotificationProvider }