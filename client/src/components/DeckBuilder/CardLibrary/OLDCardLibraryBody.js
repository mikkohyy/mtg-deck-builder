import CardLibraryRow from './CardLibraryRow'
import styled from 'styled-components'

const BodyContainer = styled.div`
  border: dotted black 2px;
  overflow-y: auto;
  min-height: 0;
`

const CardLibraryBody = ({ cards }) => {
  return(
    <BodyContainer>
      {cards.map(card =>
        <CardLibraryRow
          key={`${card.id}-${card.name}`}
          card={card}
        />
      )}
    </BodyContainer>
  )
}

export default CardLibraryBody