import CardSetInformationPage from './CardSetInformation'
import ChooseFieldsPage from './ChooseFields'
import OpenCardsJSON from './OpenCardsJSON'
import SummaryPage from './Summary'

const CurrentPage = ({
  pageNumber,
  openCardSetAfterAddition,
  setOpenCardSetAfterAddition,
  newCardSetState,
  newCardSetDispatch
}) => {
  const getPage = (number) => {
    if (number === 1) {
      return (
        <CardSetInformationPage
          newCardSetState={newCardSetState}
          newCardSetDispatch={newCardSetDispatch}
        />
      )
    } else if (number === 2) {
      return (
        <OpenCardsJSON
          newCardSetState={newCardSetState}
          newCardSetDispatch={newCardSetDispatch}
        />
      )
    } else if (number === 3) {
      return (
        <ChooseFieldsPage
          newCardSetState={newCardSetState}
          newCardSetDispatch={newCardSetDispatch}
        />
      )
    } else if (number === 4) {
      return (
        <SummaryPage
          openCardSetAfterAddition={openCardSetAfterAddition}
          setOpenCardSetAfterAddition={setOpenCardSetAfterAddition}
          newCardSetState={newCardSetState}
        />
      )
    } else {
      return <div>This should not be visible..</div>
    }
  }

  return(getPage(pageNumber))
}

export default CurrentPage