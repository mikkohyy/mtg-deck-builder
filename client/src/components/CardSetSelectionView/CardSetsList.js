import useCardSetsRowSelection from '../../hooks/useCardSetRowSelection'
import CardSetsTable from './CardSetsTable'
import styled from 'styled-components'
import { getCardSetWithId } from '../../services/card_sets'
import { useContext } from 'react'
import { CardSetContext } from '../../contexts/cardSetContext'

const CardSets = styled.div`
  background-color: #DEF2F1;
  z-index: 1;
  position: absolute;
  padding: 1em;
  border: 2px solid;
  border-color: #2B7A78;
  border-radius: 0.2em;
`

const CardSetsList = ({ cardSets, setCardSetIsOpen }) => {
  const { selectCardSetRow, selectedCardSet, isRowSelected } = useCardSetsRowSelection()
  const { setOpenedCardSet } = useContext(CardSetContext)

  const openCardSet = async() => {
    const cardSetId = selectedCardSet.id
    const data = await getCardSetWithId(cardSetId)
    setOpenedCardSet(data)
    setCardSetIsOpen()
  }

  return(
    <CardSets>
      <CardSetsTable
        cardSets={cardSets}
        selectCardSetRow={selectCardSetRow}
        selectedCardSet={selectedCardSet}
        isRowSelected={isRowSelected}
      />
      <button onClick={openCardSet}>Open</button>
      <button onClick={setCardSetIsOpen}>Close</button>
    </CardSets>
  )
}

export default CardSetsList