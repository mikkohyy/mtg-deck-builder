import styled from 'styled-components'
import CardLibraryHeader from './CardLibraryHeader'
import CardLibraryBody from './CardLibraryBody'
import { useContext } from 'react'
import { CardSetContext } from '../../../contexts/cardSetContext'

const CardLibraryContainer = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  border: solid 1px red;
`

const CardLibraryTable = () => {
  const { openedCardSet } = useContext(CardSetContext)

  return(
    <CardLibraryContainer>
      <CardLibraryHeader />
      { openedCardSet === undefined
        ? null
        : <CardLibraryBody cards={openedCardSet.cards} />
      }
    </CardLibraryContainer>
  )
}

export default CardLibraryTable