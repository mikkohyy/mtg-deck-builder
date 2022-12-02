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
import { CardSetsContext } from '../../../contexts/cardSetsContext'
import SubWindowNavigationButton from '../../Generic/SubWindowNavigationButton'

const AddCardSetContainer = styled.div`
  ${props => props.theme.components.containers.subWindow};
  height: 24em;
  width: 37em;
  overflow: auto;
  padding-top: 0.5em;
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${props => props.theme.components.buttons.gapBetween};
  margin-top: 0.5em;
`

const AddCardSet = ({ toggleAddCardSet }) => {
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
  const { cardSetsDispatch } = useContext(CardSetsContext)

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
        <SubWindowNavigationButton
          text='Next'
          onClick={moveToNextPage}
          isActivePassive={true}
          isActive={isOnLastPage() === false}
        />
        <SubWindowNavigationButton
          text='Add card set'
          onClick={addCardSetToDatabase}
          isActivePassive={true}
          isActive={isOnLastPage() === true}
        />
        <SubWindowNavigationButton
          text='Cancel'
          onClick={toggleAddCardSet}
        />
      </ButtonRow>
    </AddCardSetContainer>
  )
}

export default AddCardSet