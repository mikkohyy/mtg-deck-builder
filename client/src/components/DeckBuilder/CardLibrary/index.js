import styled from 'styled-components'
import { useContext } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import GridTable from '../../Generic/GridTable'
import CardLibraryRow from './CardLibraryRow'

const CardLibraryContainer = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  border: solid 1px red;
`

const CardLibrary = () => {
  const { openedCardSet } = useContext(OpenedCardSetContext)
  const gridColumnWidths = '2fr 1fr 2fr'

  const getRows = (columnWidths) => {
    let rows = []

    if (openedCardSet !== undefined) {
      rows = openedCardSet.cards.map(card =>
        <CardLibraryRow
          key={`Library-card${card.id}`}
          card={card}
          gridColumnWidths={columnWidths}
        />
      )
    }

    return rows
  }

  return(
    <CardLibraryContainer>
      <div>
        Here are controls
      </div>
      <GridTable
        gridColumnWidths={gridColumnWidths}
        headerTexts={['Name', 'Mana cost', 'Price']}
        rows={getRows(gridColumnWidths)}
      />
    </CardLibraryContainer>
  )
}

export default CardLibrary