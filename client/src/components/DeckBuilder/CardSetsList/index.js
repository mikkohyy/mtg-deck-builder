import useCardSetsRowSelection from '../../../hooks/useCardSetRowSelection'
import CardSetsTable from './CardSetsTable'
import styled from 'styled-components'
import { getCardSetWithId } from '../../../services/card_sets'
import { useContext } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import BasicButton from '../../Generic/BasicButton'

const CardSets = styled.div`
  background-color: #DEF2F1;
  z-index: 1;
  position: absolute;
  padding: 1em;
  border: 2px solid;
  border-color: #2B7A78;
  border-radius: 0.2em;
`

const CardSetsList = ({ setCardSetsListIsOpen }) => {
  const { selectThisCardSetRow, selectedCardSet } = useCardSetsRowSelection()
  const { setOpenedCardSet } = useContext(OpenedCardSetContext)

  const closeCardSetsList = () => {
    setCardSetsListIsOpen(false)
  }

  const openCardSet = async() => {
    if (selectedCardSet !== null) {
      try {
        const cardSetId = selectedCardSet.id
        const data = await getCardSetWithId(cardSetId)
        setOpenedCardSet(data)
        closeCardSetsList()
      } catch(error) {
        console.log(error)
      }
    }
  }

  return(
    <CardSets>
      <CardSetsTable
        selectThisCardSetRow={selectThisCardSetRow}
        selectedCardSet={selectedCardSet}
      />
      <BasicButton text='Open' onClick={openCardSet} />
      <BasicButton text='Close' onClick={closeCardSetsList} />
    </CardSets>
  )
}

export default CardSetsList