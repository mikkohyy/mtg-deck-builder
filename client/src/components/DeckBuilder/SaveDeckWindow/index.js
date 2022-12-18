import Notification from '../../Generic/Notification'
import { notificationContext } from '../../../contexts/notificationContext'
import { useContext, useState } from 'react'
import { OpenedDeckContext } from '../../../contexts/openedDeckContext'
import styled from 'styled-components'
import SubWindowNavigationButton from '../../Generic/SubWindowNavigationButton'
import { addDeck } from '../../../services/decks'

const SaveDeckContainer = styled.div`
  ${props => props.theme.components.containers.subWindow};
  right: ${props => props.theme.paddings.fromSides};
  gap: 0.3em;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${props => props.theme.components.buttons.gapBetween};
`

const DescriptionTextArea = styled.textarea`
  resize: none;
  font-family: inherit;
`

const StyledInput = styled.input`
  ${props => props.theme.components.inputs.textInput};
`

const StyledHeader = styled.h3`
  margin: 0em 0em 0.5em 0em;
`

const SaveDeckWindow = ({ toggleSaveDeck }) => {
  const { openedDeck, getDeckForSavingAsNew } = useContext(OpenedDeckContext)
  const { showNotification } = useContext(notificationContext)

  const [name, setName] = useState(openedDeck.name)
  const [notes, setNotes] = useState(openedDeck.notes)

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleNotesChange = (event) => {
    setNotes(event.target.value)
  }

  const handleCancel = () => {
    toggleSaveDeck()
  }

  const saveAsNew = () => {
    if (name.trim().length === 0) {
      showNotification(<Notification
        header='Name of the deck is missing'
        message='Add name for the deck'
      />)
    } else {
      try {
        // NOTE: hard coded user id for now (username: cerealkiller, password: password)
        const newDeck = getDeckForSavingAsNew(3, name, notes)
        addDeck(newDeck)
      } catch (error) {
        showNotification(<Notification
          header='Adding the deck failed'
          message='Adding the deck was not successful'
        />)
        console.log(error)
      }
    }
  }

  return(
    <SaveDeckContainer>
      <StyledHeader>Save deck</StyledHeader>
      <label htmlFor='deckNameInput'>Name:</label>
      <StyledInput
        type='text'
        id='deckNameInput'
        name='deckNameInput'
        onChange={handleNameChange}
        value={name}
        maxLength='50'
      />
      <label htmlFor='deckNotesInput'>Notes:</label>
      <DescriptionTextArea
        type='textarea'
        id='deckNotesInput'
        name='deckNotesInput'
        rows='7'
        cols='65'
        onChange={handleNotesChange}
        value={notes}
        maxLength='1000'
      />
      <ButtonRow>
        <SubWindowNavigationButton
          text='Update current'
          isActivePassive={true}
          isActive={openedDeck.id !== undefined}
        />
        <SubWindowNavigationButton text='Save as new' onClick={saveAsNew} />
        <SubWindowNavigationButton text='Cancel' onClick={handleCancel} />
      </ButtonRow>
    </SaveDeckContainer>
  )
}

export default SaveDeckWindow