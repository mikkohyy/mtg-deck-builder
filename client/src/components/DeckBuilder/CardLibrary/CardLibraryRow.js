import BodyCell from '../../Generic/GridTable/BodyCell'
import ManaSymbols from './ManaSymbols'
import Row from '../../Generic/GridTable/Row'

const CardLibraryRow = ({ card, gridColumnWidths, background }) => {
  return(
    <Row gridColumnWidths={gridColumnWidths} background={background}>
      <BodyCell cellStyle={props => props.theme.components.tables.body.textCell}>
        {card.name}
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        <ManaSymbols manaSymbols={card.manaSymbols} cardName={card.name} index={card.id} />
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        {card.price}
      </BodyCell>
    </Row>
  )
}

export default CardLibraryRow