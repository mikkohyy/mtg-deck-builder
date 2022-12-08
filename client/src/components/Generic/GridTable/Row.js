import styled from 'styled-components'

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.gridColumnWidths};
  background: ${props => props.background};
`
const Row = ({ gridColumnWidths, children, background }) => {
  return(
    <RowContainer gridColumnWidths={gridColumnWidths} background={background}>
      {children}
    </RowContainer>
  )
}

export default Row