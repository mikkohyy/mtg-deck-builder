import styled from 'styled-components'
import useHoverOnBox from '../../../hooks/useHoverOnBox'
import CardInformation from './CardInformation'

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr;
  padding: 0.5em;
`

const CardLibraryRow = ({ card }) => {
  const {
    isVisible,
    pointerCoordinates,
    pointerLeft,
    pointerMoved,
    pointerEntered
  } = useHoverOnBox(card.name)

  return(
    <Row>
      <div onPointerEnter={pointerEntered} onPointerLeave={pointerLeft} onPointerMove={pointerMoved}>
        <div>
          { isVisible === true
            ? <CardInformation card={card} pointerCoordinates={pointerCoordinates} />
            : null }
        </div>
        {card.name}
      </div>
      <div>{card.manaCost}</div>
      <div>{card.price}</div>
    </Row>
  )
}
export default CardLibraryRow