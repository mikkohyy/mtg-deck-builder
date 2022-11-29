import { useContext } from 'react'
import CardSetsTableHead from './CardSetsTableHead'
import CardSetsTableRow from './CardSetsTableRow'
import { CardSetsContext } from '../../../contexts/cardSetsContext'

const CardSetsTable = ({ selectThisCardSetRow, selectedCardSet }) => {
  const { cardSetsState } = useContext(CardSetsContext)

  return(
    <table>
      <CardSetsTableHead />
      <tbody>
        { cardSetsState.map(cardSet => {
          return(
            <CardSetsTableRow
              key={`${cardSet.name}-${cardSet.id}`}
              cardSet={cardSet}
              selectThisCardSetRow={selectThisCardSetRow}
              selectedCardSet={selectedCardSet}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default CardSetsTable