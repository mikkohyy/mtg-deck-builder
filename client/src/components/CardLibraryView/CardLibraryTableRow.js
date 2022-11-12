import usePopUpBox from '../../hooks/usePopUpBox'
import CardInformation from './CardInformation'

const CardLibraryTableRow = ({ card }) => {
  const {
    isVisible,
    pointerCoordinates,
    pointerLeft,
    pointerMoved,
    pointerEntered
  } = usePopUpBox(card.name)

  return(
    <tr>
      <td onPointerEnter={pointerEntered} onPointerLeave={pointerLeft} onPointerMove={pointerMoved}>
        <div>
          { isVisible === true
            ? <CardInformation card={card} pointerCoordinates={pointerCoordinates} />
            : null }
        </div>
        {card.name}
      </td>
      <td>{card.manaCost}</td>
      <td>{card.price}</td>
    </tr>
  )
}

export default CardLibraryTableRow