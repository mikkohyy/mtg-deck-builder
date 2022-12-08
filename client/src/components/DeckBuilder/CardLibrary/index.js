import styled from 'styled-components'
import { useContext } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'
import GridTable from '../../Generic/GridTable'
import CardLibraryRow from './CardLibraryRow'

const CardLibraryContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`

const CardLibrary = () => {
  const { openedCardSet } = useContext(OpenedCardSetContext)
  const gridColumnWidths = '3fr 1fr 1fr'

  const getRows = (columnWidths) => {
    let rows = []

    if (openedCardSet !== undefined) {
      rows = openedCardSet.cards.map((card, index) =>
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