import styled from 'styled-components'
import HeaderCell from './HeaderCell'

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.gridColumnWidths};
  background: ${props => props.theme.basicPalette.light};
  border: solid 1px ${props => props.theme.basicPalette.darkest};
`

const GridTableHeader = ({ headerTexts, gridColumnWidths }) => {
  return(
    <HeaderRow gridColumnWidths={gridColumnWidths}>
      {headerTexts.map(text => <HeaderCell key={`LibraryTableHead-${text}`} text={text}/>)}
    </HeaderRow>
  )
}

export default GridTableHeader