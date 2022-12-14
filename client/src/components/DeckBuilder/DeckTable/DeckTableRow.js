import Row from '../../Generic/GridTable/Row'
import BodyCell from '../../Generic/GridTable/BodyCell'
import ManaSymbols from '../../Generic/ManaSymbols'
import CardNCell from './CardNCell'

const DeckTableRow = ({ card, gridColumnWidths, background }) => {
  return(
    <Row gridColumnWidths={gridColumnWidths} background={background}>
      <BodyCell cellStyle={props => props.theme.components.tables.body.textCell}>
        {card.name}
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        <ManaSymbols manaSymbols={card.manaSymbols} cardName={card.name} />
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        <CardNCell card={card} />
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        {(card.price * card.nInDeck).toFixed(2)}
      </BodyCell>
    </Row>
  )
}

export default DeckTableRow