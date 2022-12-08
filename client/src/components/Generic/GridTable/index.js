import styled from 'styled-components'
import Header from './Header'
import Body from './Body'

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`

const GridTable = ({ gridColumnWidths, headerTexts, rows }) => {
  return(
    <TableContainer>
      <Header headerTexts={headerTexts} gridColumnWidths={gridColumnWidths} />
      <Body>
        {rows}
      </Body>
    </TableContainer>
  )
}

export default GridTable