import styled from 'styled-components'
import Header from './Header'

const TableContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1ft;
  border: solid 1px red;
`

const GridTable = ({ gridColumnWidths, headerTexts, rows }) => {

  return(
    <TableContainer>
      <Header headerTexts={headerTexts} gridColumnWidths={gridColumnWidths} />
      <div>
        {rows}
      </div>

    </TableContainer>
  )
}

export default GridTable