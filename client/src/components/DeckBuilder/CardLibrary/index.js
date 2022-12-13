import styled from 'styled-components'
import { useContext, useEffect, useState } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import GridTable from '../../Generic/GridTable'
import CardLibraryRow from './CardLibraryRow'
import LibraryControls from './LibraryControls'
import { comparisonFunctions } from '../../../utils/comparison_utils'

const CardLibraryContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`

const CardLibrary = () => {
  const { openedCardSet } = useContext(OpenedCardSetContext)
  const [filteredCards, setFilteredCards] = useState(undefined)
  const gridColumnWidths = '8fr 2fr 2fr 2fr'

  const orderCardsAlphabetically = (cards) => {
    const cardsCopy = [...cards]
    cardsCopy.sort((firstCard, secondCard) => comparisonFunctions['name'](firstCard, secondCard))

    return cardsCopy
  }

  useEffect(() => {
    if (openedCardSet !== undefined) {
      setFilteredCards(orderCardsAlphabetically(openedCardSet.cards))
    }
  }, [openedCardSet])

  const getRows = (columnWidths) => {
    let rows = []

    if (filteredCards !== undefined) {
      rows = filteredCards.map((card, index) =>
        <CardLibraryRow
          key={`Library-card${card.id}`}
          card={card}
          gridColumnWidths={columnWidths}
          background={index % 2 === 0
            ? props => props.theme.components.tables.rowColors.even
            : props => props.theme.components.tables.rowColors.odd
          }
        />
      )
    }

    return rows
  }

  return(
    <CardLibraryContainer>
      <LibraryControls
        openedCardSet={openedCardSet}
        setFilteredCards={setFilteredCards}
      />
      <GridTable
        gridColumnWidths={gridColumnWidths}
        headerTexts={['Name', 'Mana cost', 'Price', '']}
        rows={getRows(gridColumnWidths)}
      />
    </CardLibraryContainer>
  )
}

export default CardLibrary