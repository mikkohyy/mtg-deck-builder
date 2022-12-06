import BodyCell from '../../Generic/GridTable/BodyCell'
import Row from '../../Generic/GridTable/Row'

const CardLibraryRow = ({ card, gridColumnWidths }) => {

  return(
    <Row gridColumnWidths={gridColumnWidths}>
      <BodyCell content={card.name} />
      <BodyCell content={card.manaCost} />
      <BodyCell content={card.price} />
    </Row>
  )
}

export default CardLibraryRow