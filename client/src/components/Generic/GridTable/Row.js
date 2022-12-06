import styled from 'styled-components'

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.gridColumnWidths};
`
const Row = ({ gridColumnWidths, children }) => {
  return(
    <RowContainer gridColumnWidths={gridColumnWidths}>
      {children}
    </RowContainer>
  )
}

export default Row