import styled from 'styled-components'
import { useContext } from 'react'
import CardSetsTableHead from './CardSetsTableHead'
import CardSetsTableRow from './CardSetsTableRow'
import { CardSetsContext } from '../../../contexts/cardSetsContext'

const StyledTable = styled.table`
  border-collapse: collapse;
`

const StyledTableBody = styled.tbody`
  border: solid 1px ${props => props.theme.basicPalette.darkest}
`

const CardSetsTable = ({ selectThisCardSetRow, selectedCardSet }) => {
  const { cardSetsState } = useContext(CardSetsContext)

  return(
    <StyledTable>
      <CardSetsTableHead />
      <StyledTableBody>
        { cardSetsState.map((cardSet, index) => {
          return(
            <CardSetsTableRow
              key={`${cardSet.name}-${cardSet.id}`}
              cardSet={cardSet}
              selectThisCardSetRow={selectThisCardSetRow}
              selectedCardSet={selectedCardSet}
              backgroundColor={
                index % 2 === 0
                  ? (props => props.theme.components.tables.rowColors.even)
                  : (props => props.theme.components.tables.rowColors.odd)
              }
            />
          )
        })}
      </StyledTableBody>
    </StyledTable>
  )
}

export default CardSetsTable