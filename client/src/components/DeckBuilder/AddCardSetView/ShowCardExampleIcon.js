import usePopUpBox from '../../../hooks/usePopUpBox'
import styled from 'styled-components'
import CardExample from './CardExample'

const IconContainer = styled.div`
  display: inline;
  margin-left: 0.5em;
  border-radius: 0.3em;
  border: solid 1px black;
  font-size: 0.7em;
  padding: 0.1em;
`

const ExampleText = styled.div`
  max-width: 30em;
  padding: 1em;
  position: absolute;
  font-size: 1.1em;
  border: solid 2px ${props => props.theme.basicPalette.dark};
  background: ${props => props.theme.basicPalette.light};
  border-radius: ${props => props.theme.boxProperties.corners}
`

const ShowCardExampleIcon = () => {
  const { pointerLeft, isVisible, pointerCoordinates, pointerMoved, pointerEntered } = usePopUpBox()
  return(
    <IconContainer
      onPointerEnter={pointerEntered}
      onPointerLeave={pointerLeft}
      onPointerMove={pointerMoved}
    >
      { isVisible === true
        ? <ExampleText
          x={pointerCoordinates.x}
          y={pointerCoordinates.y}>
          <CardExample />
        </ExampleText>
        : null
      }
      Example
    </IconContainer>
  )
}

export default ShowCardExampleIcon