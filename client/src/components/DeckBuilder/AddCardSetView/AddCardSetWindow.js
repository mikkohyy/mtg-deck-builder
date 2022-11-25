import CardSetInformationError from './Notifications/CardSetInformationError'
import OpenCardsJSONError from './Notifications/OpenCardsJSONError'
import ChooseFieldsError from './Notifications/ChooseFieldsError'
import CardSetAdditionWasSuccessfulNotification from './Notifications/CardSetAdditionWasSuccessfulNotification'
import CurrentPage from './CurrentPage'
import styled from 'styled-components'
import useAddCardSet from '../../../hooks/useAddCardSet'
import useViewWithPages from '../../../hooks/useViewWithPages'
import { useContext, useState } from 'react'
import { notificationMessageContext } from '../../../contexts/notificationMessageContext'
import { addCardSet } from '../../../services/card_sets'
import { CardSetContext } from '../../../contexts/cardSetContext'

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
`

const ButtonRow = styled.div`
  display: flex;
`

const ActiveButton = styled.button`
  ${props => props.theme.components.buttons.secondaryButton.active}
`

const PassiveButton = styled.button`
  ${props => props.theme.components.buttons.secondaryButton.passive}
`

const AddCardSetWindow = ({ toggleAddCardSet, dispatchCardSetsList }) => {
  const nOfPages = 4
  const CARD_SET_INFORMATION_PAGE_NUMBER = 1
  const OPEN_CARDS_JSON_PAGE_NUMBER = 2
  const CHOOSE_CARD_FIELDS_PAGE_NUMBER = 3
  const SUMMARY_PAGE = 4
  const { showNotificationMessage } = useContext(notificationMessageContext)
  const [openAddedCardSet, setOpenAddedCardSet] = useState(true)
  const { setOpenedCardSet } = useContext(CardSetContext)

  const { goToNextPage, isOnLastPage, pageNumber, setPageNumber } = useViewWithPages(nOfPages)
  const {
    cardSetName,
    setCardSetName,
    cardSetDescription,
    setCardSetDescription,
    addCardsToCardSet,
    cardKeyNames,
    canMoveToNextPage,
    cardSetCards,
    setFieldName,
    getFieldName,
    fieldNames,
    getCardSetObject
  } = useAddCardSet(pageNumber)

  const changePage = () => {
    if (canMoveToNextPage() === true) {
      pageNumber === OPEN_CARDS_JSON_PAGE_NUMBER && cardSetCards.length === 0
        ? setPageNumber(SUMMARY_PAGE)
        : goToNextPage()
    } else {
      if (pageNumber === CARD_SET_INFORMATION_PAGE_NUMBER) {
        showNotificationMessage(<CardSetInformationError />)
      } else if (pageNumber === OPEN_CARDS_JSON_PAGE_NUMBER) {
        showNotificationMessage(<OpenCardsJSONError />)
      } else if (pageNumber === CHOOSE_CARD_FIELDS_PAGE_NUMBER) {
        showNotificationMessage(<ChooseFieldsError />)
      }
    }
  }

  const addCardSetToDatabase = async () => {
    const cardSetObject = getCardSetObject()
    try {
      const addedCardSet = await addCardSet(cardSetObject)
      toggleAddCardSet()
      showNotificationMessage(<CardSetAdditionWasSuccessfulNotification />)
      if (openAddedCardSet === true) {
        setOpenedCardSet(addedCardSet)
      }

      dispatchCardSetsList({
        type: 'ADD_CARD_SET',
        payload: addedCardSet
      })
    } catch(error) {
      console.log(error.response.data)
    }
  }

  return(
    <AddCardSetContainer>
      { pageNumber !== undefined
        ? <CurrentPage
          pageNumber={pageNumber}
          cardSetName={cardSetName}
          setCardSetName={setCardSetName}
          cardSetDescription={cardSetDescription}
          setCardSetDescription={setCardSetDescription}
          addCardsToCardSet={addCardsToCardSet}
          cardKeyNames={cardKeyNames}
          cardSetCards={cardSetCards}
          setFieldName={setFieldName}
          getFieldName={getFieldName}
          fieldNames={fieldNames}
          openAddedCardSet={openAddedCardSet}
          setOpenAddedCardSet={setOpenAddedCardSet}
        />
        : null
      }
      <ButtonRow>
        { isOnLastPage() === true
          ? <PassiveButton>Next</PassiveButton>
          : <ActiveButton onClick={changePage}>Next</ActiveButton>
        }
        { isOnLastPage() === true
          ? <ActiveButton onClick={addCardSetToDatabase}>Add card set</ActiveButton>
          : <PassiveButton>Add card set</PassiveButton>
        }
        <button onClick={toggleAddCardSet}>Cancel</button>
      </ButtonRow>
    </AddCardSetContainer>
  )
}

export default AddCardSetWindow