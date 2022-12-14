import styled from 'styled-components'

const Cell = styled.div`
  ${props => props.cellStyle};
  border: solid 1px black;
`

const BodyCell = ({ children, cellStyle }) => {
  return(
    <Cell cellStyle={cellStyle}>
      {children}
    </Cell>
  )
}

export default BodyCell