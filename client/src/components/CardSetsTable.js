import CardSetsTableHead from './CardSetsTableHead'
import CardSetsTableRow from './CardSetsTableRow'
import useCardSetsRowSelection from '../hooks/useCardSetRowSelection'

const CardSetsTable = ({ cardSets }) => {
  const { selectCardSetRow, selectedCardSet, isRowSelected } = useCardSetsRowSelection()

  return(
    <table>
      <CardSetsTableHead />
      <tbody>
        { cardSets.map(cardSet => {
          return(
            <CardSetsTableRow
              key={cardSet.name}
              cardSet={cardSet}
              selectCardSetRow={selectCardSetRow}
              selectedCardSet={selectedCardSet}
              isRowSelected={isRowSelected}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default CardSetsTable