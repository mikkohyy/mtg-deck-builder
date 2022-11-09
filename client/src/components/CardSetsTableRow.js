import { useState, useEffect } from 'react'
import styled from 'styled-components'

const Cell = styled.td`
  padding: 0.5em;
`
const Row = styled.tr`
  background: ${props => props.isSelected ? '#3AAFA9' : '#DEF2F1'};
`

const CardSetsTableRow = ({ cardSet, selectCardSetRow, selectedCardSet, isRowSelected }) => {
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    const selected = isRowSelected(cardSet)
    setIsSelected(selected)
  }, [selectedCardSet])

  const selectThisRow = () => {
    selectCardSetRow(cardSet)
  }

  return(
    <Row isSelected={isSelected} onClick={() => selectThisRow()}>
      <Cell>{cardSet.name}</Cell>
      <Cell>{cardSet.date.toLocaleDateString()}</Cell>
    </Row>
  )
}

export default CardSetsTableRow