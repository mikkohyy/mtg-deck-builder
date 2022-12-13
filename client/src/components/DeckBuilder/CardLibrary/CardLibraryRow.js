import BodyCell from '../../Generic/GridTable/BodyCell'
import ManaSymbols from './ManaSymbols'
import CardPopUp from './CardPopUp'
import Row from '../../Generic/GridTable/Row'
import useHoverOnBox from '../../../hooks/useHoverOnBox'
import AddToDeckWidget from './AddToDeckWidget'

const CardLibraryRow = ({ card, gridColumnWidths, background }) => {
  const {
    isVisible,
    pointerCoordinates,
    pointerLeft,
    pointerMoved,
    pointerEntered
  } = useHoverOnBox(card.name)

  return(
    <Row gridColumnWidths={gridColumnWidths} background={background}>
      <BodyCell cellStyle={props => props.theme.components.tables.body.textCell}>
        <div onPointerEnter={pointerEntered} onPointerLeave={pointerLeft} onPointerMove={pointerMoved}>
          {card.name}
          { isVisible === true
            ? <CardPopUp card={card} pointerCoordinates={pointerCoordinates} />
            : null }
        </div>
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        <ManaSymbols manaSymbols={card.manaSymbols} cardName={card.name} index={card.id} />
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        {card.price}
      </BodyCell>
      <BodyCell cellStyle={props => props.theme.components.tables.body.elementCell}>
        <AddToDeckWidget />
      </BodyCell>
    </Row>
  )
}

export default CardLibraryRow