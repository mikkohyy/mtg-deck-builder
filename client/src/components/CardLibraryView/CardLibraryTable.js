import styled from 'styled-components'
import CardLibraryTableHead from './CardLibraryTableHead'
import CardLibraryTableBody from './CardLibraryTableBody'

const CardLibraryContainer = styled.div`
  max-width: 40%;
  border-style: solid;
  border-color: black;
`
const CardLibraryTable = () => {
  return(
    <CardLibraryContainer>
      <h3>Card library</h3>
      <table>
        <CardLibraryTableHead />
        <CardLibraryTableBody />
      </table>
    </CardLibraryContainer>
  )
}

export default CardLibraryTable