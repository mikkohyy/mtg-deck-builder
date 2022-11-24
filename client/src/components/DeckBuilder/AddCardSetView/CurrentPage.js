import CardSetInformationPage from './CardSetInformationPage'
import ChooseFieldsPage from './ChooseFieldsPage'
import OpenCardsJSONPage from './OpenCardsJSONPage'
import WhenNoCardFieldsPage from './WhenNoCardFieldsPage'
import SummaryPage from './SummaryPage'

const CurrentPage = ({
  pageNumber,
  cardSetName,
  setCardSetName,
  cardSetDescription,
  setCardSetDescription,
  addCardsToCardSet,
  cardKeyNames,
  cardSetCards,
  setFieldName,
  getFieldName,
  fieldNames,
  getFieldNamesAsArray,
  openAddedCardSet,
  setOpenAddedCardSet
}) => {
  const getPage = (number) => {
    if (number === 1) {
      return (
        <CardSetInformationPage
          cardSetName={cardSetName}
          setCardSetName={setCardSetName}
          cardSetDescription={cardSetDescription}
          setCardSetDescription={setCardSetDescription}
        />
      )
    } else if (number === 2) {
      return (
        <OpenCardsJSONPage
          addCardsToCardSet={addCardsToCardSet}
        />
      )
    } else if (number === 3) {
      if (cardSetCards.length === 0) {
        return <WhenNoCardFieldsPage />
      } else {
        return (
          <ChooseFieldsPage
            cardKeyNames={cardKeyNames}
            setFieldName={setFieldName}
            getFieldName={getFieldName}
            fieldNames={fieldNames}
          />
        )
      }
    } else if (number === 4) {
      return (
        <SummaryPage
          cardSetName={cardSetName}
          cardSetDescription={cardSetDescription}
          fieldNames={fieldNames}
          getFieldNamesAsArray={getFieldNamesAsArray}
          cardSetCards={cardSetCards}
          openAddedCardSet={openAddedCardSet}
          setOpenAddedCardSet={setOpenAddedCardSet}
        />
      )
    } else {
      return <div>This should not be visible..</div>
    }
  }

  return(getPage(pageNumber))
}

export default CurrentPage