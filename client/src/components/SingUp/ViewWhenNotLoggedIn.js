import { useState } from 'react'
import styled from 'styled-components'
import SignUpForm from './SignUpForm'
import CreatedNewUserView from './CreatedNewUserView'

const CentralContainer = styled.div`
  width: 30em;
`
const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
`

const ViewWhenNotLoggedIn = () => {
  const [createdUser, setCreatedUser] = useState(undefined)

  return(
    <CentralContainer>
      <TitleContainer>
        <h1>Sign up to MTG Deck Builder</h1>
      </TitleContainer>
      {createdUser !== undefined
        ? <CreatedNewUserView createdUser={createdUser} />
        : <SignUpForm setCreatedUser={setCreatedUser} />
      }
    </CentralContainer>
  )
}

export default ViewWhenNotLoggedIn