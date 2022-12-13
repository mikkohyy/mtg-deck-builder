import DeckTableRow from './DeckTableRow'
import GridTable from '../../Generic/GridTable'
import { OpenedDeckContext } from '../../../contexts/openedDeckContext'
import { useContext } from  'react'
import styled from 'styled-components'
import { useEffect } from 'react'

const DeckTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`

const DeckTable = () => {
  const { openedDeck, setOpenedDeck } = useContext(OpenedDeckContext)
  const gridColumnWidths = '8fr 2fr 2fr 2fr'

  useEffect(() => {
    if (openedDeck === undefined) {
      setOpenedDeck({
        cards: [],
        changes: {
          added: [],
          deleted: [],
          updated: []
        }
      })
    }
  }, [])

  const getRows = () => {
    return(
      openedDeck.cards
        .map((card, index) =>
          <DeckTableRow
            key={`Decktablecard-${card.id}`}
            card={card}
            gridColumnWidths={gridColumnWidths}
            background={index % 2 === 0
              ? props => props.theme.components.tables.rowColors.even
              : props => props.theme.components.tables.rowColors.odd
            }
          />
        )
    )
  }

  return(
    <DeckTableContainer>
      <GridTable
        gridColumnWidths={gridColumnWidths}
        headerTexts={['Name', 'Mana cost', 'N', 'Cost']}
        rows={openedDeck !== undefined ? getRows() : []}
      />
    </DeckTableContainer>
  )
}

export default DeckTable