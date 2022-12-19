import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from '../../utils/constants'
import { loginUser } from '../../services/login'
import { LoggedInUserContext } from '../../contexts/loggedInUserContext'
import { useState, useContext } from 'react'
import styled from 'styled-components'
import MainWindowInput from '../Generic/FormElements/MainWindowInput'

const CentralContainer = styled.div`
  width: 30em;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
`

const GappedForm = styled.form`
  row-gap: 0.5em;
`

const StyledButton = styled.button`
  ${props => props.theme.components.buttons.mainWindow.active};
  margin-top: 0.5em;
  :hover {
    ${props => props.theme.components.buttons.mainWindow.hovered};
  }
`

const LoginErrorContainer = styled.div`
  display: flex;
  background: ${props => props.theme.basicPalette.errorBackground};
  border: solid 1px ${props => props.theme.basicPalette.errorBorder};
  border-radius: ${props => props.theme.sharedProperties.containers.borderRadius};
  padding: 0.5em;
  margin-top: 0.5em;
`

const ViewWhenNotLoggedIn = () => {
  const { setLoggedInUser } = useContext(LoggedInUserContext)
  const [usernameField, setUsernameField] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(undefined)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const { data } = await loginUser(usernameField, password)
      setLoggedInUser(data.username, data.token, data.decks)
      if (errorMessage !== undefined) {
        setErrorMessage(undefined)
      }
    } catch(error) {
      console.log(error)
      setErrorMessage(error.response.data.message)
    }
  }

  return(
    <CentralContainer>
      <TitleContainer>
        <h1>Login</h1>
      </TitleContainer>
      <GappedForm onSubmit={handleLogin}>
        <MainWindowInput
          name='loginUsername'
          type='text'
          label='Username'
          value={usernameField}
          setValue={setUsernameField}
          maxLength={MAX_USERNAME_LENGTH}
        />
        <MainWindowInput
          name='loginPassword'
          type='password'
          label='Password'
          value={password}
          setValue={setPassword}
          maxLength={MAX_PASSWORD_LENGTH}
        />
        { errorMessage === undefined
          ? null
          : <LoginErrorContainer>{errorMessage}</LoginErrorContainer>}
        <StyledButton type='submit'>Login</StyledButton>
      </GappedForm>
    </CentralContainer>
  )
}

export default ViewWhenNotLoggedIn