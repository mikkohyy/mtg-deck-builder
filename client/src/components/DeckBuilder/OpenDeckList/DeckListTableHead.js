import styled from 'styled-components'

const HeadCell = styled.th`
  ${props => props.theme.components.tables.head.cell}
`

const DeckListTableHead = () => {
  return(
    <thead>
      <tr>
        <HeadCell>Name</HeadCell>
        <HeadCell>Notes</HeadCell>
      </tr>
    </thead>
  )
}

export default DeckListTableHead