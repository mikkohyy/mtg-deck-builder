import styled from 'styled-components'

const Cell = styled.div`
  ${props => props.cellStyle};
`

const BodyCell = ({ children, cellStyle }) => {
  return(
    <Cell cellStyle={cellStyle}>
      {children}
    </Cell>
  )
}

export default BodyCell