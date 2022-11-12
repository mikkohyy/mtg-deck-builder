import { useContext } from 'react'
import { CardSetContext } from '../../contexts/cardSetContext'
import CardLibraryTableRow from './CardLibraryTableRow'

const CardLibraryTableBody = () => {
  const { openedCardSet } = useContext(CardSetContext)
  return(
    <tbody>
      { openedCardSet === undefined
        ? null
        : openedCardSet.cards
          .map(card =>
            <CardLibraryTableRow
              key={`${card.id}-${card.name}`}
              card={card}
            />)
      }
    </tbody>
  )
}

export default CardLibraryTableBody