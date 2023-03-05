import { useContext } from 'react'
import { LoggedInUserContext } from '../../../contexts/loggedInUserContext'
import styled from 'styled-components'
import DeckListTableHead from './DeckListTableHead'
import DeckListTableRow from './DeckListTableRow'

const StyledTable = styled.table`
  border-collapse: collapse;
`

const StyledTableBody = styled.tbody`
  border: solid 1px ${props => props.theme.basicPalette.darkest}
`

const DeckListTable = ({ selectThisTableRow, selectedTableRow }) => {
  const { decks } = useContext(LoggedInUserContext)

  return (
    <StyledTable>
      <DeckListTableHead />
      <StyledTableBody>
        { decks.map((deck, index) => {
          return(
            <DeckListTableRow
              key={`${deck.id}-${deck.description}`}
              deck={deck}
              selectThisTableRow={selectThisTableRow}
              selectedTableRow={selectedTableRow}
              backgroundColor={
                index % 2 === 0
                  ? (props => props.theme.components.tables.rowColors.even)
                  : (props => props.theme.components.tables.rowColors.odd)
              }
            />
          )})
        }
      </StyledTableBody>
    </StyledTable>
  )
}

export default DeckListTable