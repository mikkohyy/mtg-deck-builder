import { createUser } from '../../services/users'
import { isEmptyString } from '../../utils/validation_utils'
import { useState } from 'react'
import styled from 'styled-components'
import MainWindowInput from '../Generic/FormElements/MainWindowInput'
import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from '../../utils/constants'

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

const SignUpForm = ({ setCreatedUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword]  = useState('')
  const [errorMessage, setErrorMessage] = useState(undefined)

  const getInfoOnInvalidFields = () => {
    let infoOnInvalidFields = []

    if (isEmptyString(username) || isEmptyString(password) || isEmptyString(repeatedPassword)) {
      infoOnInvalidFields = infoOnInvalidFields.concat('Fields cannot be empty.')
    }

    if (password !== repeatedPassword) {
      infoOnInvalidFields = infoOnInvalidFields.concat('Passwords do not match.')
    }

    return infoOnInvalidFields
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    const infoOnInvalidFields = getInfoOnInvalidFields()

    if (infoOnInvalidFields.length > 0) {
      setErrorMessage(infoOnInvalidFields.join(' '))
    } else {
      try {
        const response = await createUser(username, password)
        setCreatedUser(response.data)
      } catch(error) {
        setErrorMessage('Something went wrong. User with the same name might exist.')
      }
    }
  }

  return(
    <GappedForm>
      <MainWindowInput
        name='signupUsername'
        type='text'
        label='Username'
        value={username}
        setValue={setUsername}
        maxLength={MAX_USERNAME_LENGTH}
      />
      <MainWindowInput
        name='signupPassword'
        type='password'
        label='Password'
        value={password}
        setValue={setPassword}
        maxLength={MAX_PASSWORD_LENGTH}
      />
      <MainWindowInput
        name='repeatedPassword'
        type='password'
        label='Repeat password'
        value={repeatedPassword}
        setValue={setRepeatedPassword}
        maxLength={MAX_PASSWORD_LENGTH}
      />
      { errorMessage === undefined
        ? null
        : <LoginErrorContainer>{errorMessage}</LoginErrorContainer>}
      <StyledButton onClick={handleSignUp}>Sign up</StyledButton>
    </GappedForm>
  )
}

export default SignUpForm