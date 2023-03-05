import { useEffect, useState } from 'react'
import styled from 'styled-components'
import ButtonWithPopUpBox from '../../Generic/ButtonWithPopUpBox'

const TableCell = styled.td`
  padding: 0.5em 4em 0.5em 4em;
  text-align: center;
`
const TableRow = styled.tr`
  background: ${props => props.isSelected
    ? props.theme.basicPalette.dark
    : props.background };
`

const DeckListTableRow = ({ deck, selectThisTableRow, selectedTableRow, backgroundColor }) => {
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    let thisSetIsSelected = false

    if (userHasSelectedThisRow() === true) {
      thisSetIsSelected = true
    }

    setIsSelected(thisSetIsSelected)
  }, [selectedTableRow])

  const userHasSelectedThisRow = () => {
    let isSelected = false

    if ((selectedTableRow !== undefined && selectedTableRow.id === deck.id)) {
      isSelected = true
    }

    return isSelected
  }

  const selectRow = () => {
    selectThisTableRow(deck)
  }

  return(
    <TableRow isSelected={isSelected} background={backgroundColor}>
      <TableCell onClick={selectRow}>
        {deck.name}
      </TableCell>
      <TableCell>
        <div>
          <ButtonWithPopUpBox
            buttonTextWhenHiddenBox='Show'
            buttonTextWhenVisibleBox='Hide'
            boxText={deck.notes}
            buttonWidth='4em'
            cornerPosition='right'
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default DeckListTableRow