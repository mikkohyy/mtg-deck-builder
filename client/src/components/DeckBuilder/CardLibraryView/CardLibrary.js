import styled from 'styled-components'
import CardLibraryHeader from './CardLibraryHeader'
import CardLibraryBody from './CardLibraryBody'
import { useContext } from 'react'
import { OpenedCardSetContext } from '../../../contexts/openedCardSetContext'

const CardLibraryContainer = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  border: solid 1px red;
`

const CardLibraryTable = () => {
  const { openedCardSet } = useContext(OpenedCardSetContext)

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