import styled from 'styled-components'

const HeadCell = styled.th`
  ${props => props.theme.components.tables.head.cell}
`

const CardSetsTableHead = () => {
  return(
    <thead>
      <tr>
        <HeadCell>Card set</HeadCell>
        <HeadCell>Added</HeadCell>
        <HeadCell>Description</HeadCell>
      </tr>
    </thead>
  )
}

export default CardSetsTableHead