import styled from 'styled-components'

const Cell = styled.div`
  ${props => props.theme.components.tables.body.cell};
  text-align: center;
  border: solid 2px red;
`

const BodyCell = ({ content }) => {
  return(
    <Cell>
      {content}
    </Cell>
  )
}

export default BodyCell