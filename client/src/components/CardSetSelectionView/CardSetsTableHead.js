import styled from 'styled-components'

const HeadCell = styled.th`
  border-bottom: 2px solid #2B7A78;
  padding: 0 3em 0.5em 3em;
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