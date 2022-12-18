import { createContext, useEffect, useState } from 'react'

const LoggedInUserContext = createContext()

const LoggedInUserProvider = ({ children }) => {
  const [username, setUsername] = useState(undefined)
  const [token, setToken] = useState(undefined)
  const [decks, setDecks] = useState(undefined)

  useEffect(() => {
    if (window.localStorage.username !== undefined) {
      setUsername(window.localStorage.username)
    }

    if (window.localStorage.token !== undefined) {
      setToken(window.localStorage.token)
    }

    if (window.localStorage.decks !== undefined) {
      setDecks(JSON.parse(window.localStorage.decks))
    }
  }, [])

  const setLoggedInUser = (name, receivedToken, usersDecks) => {
    setContextUserInfo(name, receivedToken, usersDecks)
    setLocalStorageUserInfo(name, receivedToken, usersDecks)
  }

  const logOutUser = () => {
    setContextUserInfo(undefined, undefined, undefined)
    clearLocalStorageUserInfo()
  }

  const setContextUserInfo = (name, receivedToken, usersDecks) => {
    setUsername(name)
    setToken(receivedToken)
    setDecks(JSON.stringify(usersDecks))
  }

  const isUserLoggedIn = () => {
    let isLoggedIn = false

    if (window.localStorage.token !== undefined) {
      isLoggedIn = true
    }

    return isLoggedIn
  }

  const setLocalStorageUserInfo = (name, receivedToken, usersDecks) => {
    window.localStorage.setItem('username', name)
    window.localStorage.setItem('token', receivedToken)
    window.localStorage.setItem('decks', JSON.stringify(usersDecks))
  }

  const clearLocalStorageUserInfo = () => {
    window.localStorage.removeItem('username')
    window.localStorage.removeItem('token',)
    window.localStorage.removeItem('decks')
  }

  return(
    <LoggedInUserContext.Provider
      value={{
        setLoggedInUser,
        logOutUser,
        username,
        setUsername,
        token,
        setToken,
        decks,
        setDecks,
        isUserLoggedIn
      }}
    >
      {children}
    </LoggedInUserContext.Provider>
  )
}

export { LoggedInUserContext, LoggedInUserProvider }