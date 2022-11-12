import useCardSetsRowSelection from '../../hooks/useCardSetRowSelection'
import CardSetsTable from './CardSetsTable'
import styled from 'styled-components'
import cardSetServices from '../../services/card_sets'
import { useContext } from 'react'
import { CardSetContext } from '../../contexts/cardSetContext'

const CardSets = styled.div`
  background-color: #DEF2F1;
  z-index: 1;
  position: absolute;
  padding: 1em;2
  border: 2px solid;
  border-color: #2B7A78;
  border-radius: 0.2em;
`

const CardSetsList = ({ cardSets, setIsOpen }) => {
  const { selectCardSetRow, selectedCardSet, isRowSelected } = useCardSetsRowSelection()
  const { setOpenedCardSet } = useContext(CardSetContext)

  const openCardSet = async() => {
    const data = await cardSetServices.getCardSetWithId(1)
    setOpenedCardSet(data)
    setIsOpen()
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
      <button onClick={setIsOpen}>Close</button>
    </CardSets>
  )
}

export default CardSetsList