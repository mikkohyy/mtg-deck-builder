import useHoverOnBox from '../../hooks/useHoverOnBox'
import styled from 'styled-components'

const IconContainer = styled.div`
  display: inline;
  margin-left: 0.5em;
  border-radius: 0.3em;
  border: solid 1px black;
  font-size: 0.7em;
  padding: 0.1em;
`

const InformationText = styled.div`
  max-width: 24em;
  padding: 1em;
  position: absolute;
  font-size: 1.1em;
  border: solid 2px ${props => props.theme.basicPalette.dark};
  background: ${props => props.theme.basicPalette.light};
  border-radius: ${props => props.theme.boxProperties.corners}
`

const AdditionalInfoIcon = ({ infoText }) => {
  const { pointerLeft, isVisible, pointerCoordinates, pointerMoved, pointerEntered } = useHoverOnBox()
  return(
    <IconContainer
      onPointerEnter={pointerEntered}
      onPointerLeave={pointerLeft}
      onPointerMove={pointerMoved}
    >
      { isVisible === true
        ? <InformationText
          x={pointerCoordinates.x}
          y={pointerCoordinates.y}>
          {infoText}
        </InformationText>
        : null
      }
      Info
    </IconContainer>
  )
}

export default AdditionalInfoIcon