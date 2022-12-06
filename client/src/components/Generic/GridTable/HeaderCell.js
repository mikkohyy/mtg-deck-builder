import styled from 'styled-components'

const Cell = styled.div`
  ${props => props.theme.components.tables.head.cell};
  text-align: center;
  border: solid 2px red;
`

const HeaderCell = ({ text }) => {
  return(
    <Cell>
      {text}
    </Cell>
  )
}

export default HeaderCell