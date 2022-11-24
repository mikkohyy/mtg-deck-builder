import CardSetsTableHead from './CardSetsTableHead'
import CardSetsTableRow from './CardSetsTableRow'

const CardSetsTable = ({ cardSets, selectCardSetRow, selectedCardSet, isRowSelected }) => {

  return(
    <table>
      <CardSetsTableHead />
      <tbody>
        { cardSets.map(cardSet => {
          return(
            <CardSetsTableRow
              key={`${cardSet.name}-${cardSet.id}`}
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