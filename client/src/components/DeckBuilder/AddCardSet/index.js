import styled from 'styled-components'
import Notification from '../../Generic/Notification'
import SuccessfulAddition from './Notifications/SuccessfulAddition'
import Page from './Page'
import usePages from '../../../hooks/usePages'
import useCreateCardSet from '../../../hooks/useCreateCardSet'
import { useContext, useState } from 'react'
import { notificationContext } from '../../../contexts/notificationContext'
import { addCardSet } from '../../../services/card_sets'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import { isPageInputValid  } from './page_change_utils'

const AddCardSetContainer = styled.div`
  z-index: 1;
  position: absolute;
  background: ${props => props.theme.basicPalette.light};
  border: solid 2px ${props => props.theme.basicPalette.dark};
  border-radius: ${props => props.theme.boxProperties.corners};
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 50%;
  width: 40%;
  overflow: auto;
  padding: 0em 1.5em 1.5em 1.5em;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${props => props.theme.components.buttons.gapBetween};
  margin-top: 0.5em;
`

const ActiveButton = styled.button`
  ${props => props.theme.components.buttons.secondary.active}
`

const PassiveButton = styled.button`
  ${props => props.theme.components.buttons.secondary.passive}
`

const AddCardSet = ({ toggleAddCardSet, cardSetsDispatch }) => {
  const nOfPages = 4

  const INFO_PAGE_NUMBER = 1
  const SELECT_JSON_PAGE_NUMBER = 2
  const SELECT_FIELDS_PAGE_NUMBER = 3
  const SUMMARY_PAGE_NUMBER = 4

  const { goToNextPage, isOnLastPage, pageNumber, setPageNumber } = usePages(nOfPages)
  const { showNotification } = useContext(notificationContext)
  const [openCardSetAfterAddition, setOpenCardSetAfterAddition] = useState(true)
  const { setOpenedCardSet } = useContext(OpenedCardSetContext)
  const { getCardSetObject, newCardSetState, newCardSetDispatch } = useCreateCardSet()

  const moveToNextPage = () => {
    const invalidPartsOfInput = isPageInputValid(pageNumber, newCardSetState)

    if (invalidPartsOfInput.length === 0) {
      pageNumber === SELECT_JSON_PAGE_NUMBER && newCardSetState.cards.length === 0
        ? setPageNumber(SUMMARY_PAGE_NUMBER)
        : goToNextPage()
    } else {
      const message = getAsString(invalidPartsOfInput)
      if (pageNumber === INFO_PAGE_NUMBER) {
        const header = 'Invalid values'
        showNotification(<Notification header={header} message={message} />)
      } else if (pageNumber === SELECT_JSON_PAGE_NUMBER) {
        const header = 'Problem with provided cards'
        showNotification(<Notification header={header} message={message} />)
      } else if (pageNumber === SELECT_FIELDS_PAGE_NUMBER) {
        const header = 'Problem with fields'
        showNotification(<Notification header={header} message={message} />)
      }
    }
  }

  const getAsString = (arrayData) => {
    let asString

    if (arrayData.length === 0) {
      asString = arrayData.toString()
    } else {
      asString = arrayData.join(' ')
    }

    return asString
  }

  const addCardSetToDatabase = async () => {
    const cardSetObject = getCardSetObject()
    try {
      const addedCardSet = await addCardSet(cardSetObject)

      cardSetsDispatch({
        type: 'ADD_CARD_SET',
        payload: addedCardSet
      })

      if (openCardSetAfterAddition === true) {
        setOpenedCardSet(addedCardSet)
      }

      showNotification(<SuccessfulAddition toggleAddCardSet={toggleAddCardSet} />)
    } catch(error) {
      const header = 'Something went wrong'
      const message = 'Adding the card set did not succeed'
      showNotification(<Notification header={header} message={message} />)    }
  }

  return(
    <AddCardSetContainer>
      { pageNumber !== undefined
        ? <Page
          pageNumber={pageNumber}
          openCardSetAfterAddition={openCardSetAfterAddition}
          setOpenCardSetAfterAddition={setOpenCardSetAfterAddition}
          newCardSetState={newCardSetState}
          newCardSetDispatch={newCardSetDispatch}
        />
        : null
      }
      <ButtonRow>
        { isOnLastPage() === true
          ? <PassiveButton>Next</PassiveButton>
          : <ActiveButton onClick={moveToNextPage}>Next</ActiveButton>
        }
        { isOnLastPage() === true
          ? <ActiveButton onClick={addCardSetToDatabase}>Add card set</ActiveButton>
          : <PassiveButton>Add card set</PassiveButton>
        }
        <ActiveButton onClick={toggleAddCardSet}>Cancel</ActiveButton>
      </ButtonRow>
    </AddCardSetContainer>
  )
}

export default AddCardSet