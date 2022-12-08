import styled from 'styled-components'

const Cell = styled.div`
  ${props => props.theme.components.tables.head.cell};
  text-align: center;
`

const HeaderCell = ({ text }) => {
  return(
    <Cell>
      {text}
    </Cell>
  )
}

export default HeaderCell