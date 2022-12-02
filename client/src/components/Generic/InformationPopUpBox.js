import useHoverOnBox from '../../hooks/useHoverOnBox'
import styled from 'styled-components'

const TriggerContainer = styled.div`
  ${props => props.theme.components.containers.popUpTrigger}
`

const InformationContainer = styled.div`
  ${props => props.theme.components.containers.popUpBox}
  left: ${props => props.x}px;
  font-size: 1.1em;
`

const InformationPopUpBox = ({ popUpBoxText, information }) => {
  const { pointerLeft, isVisible, pointerCoordinates, pointerMoved, pointerEntered } = useHoverOnBox()

  return(
    <TriggerContainer
      onPointerEnter={pointerEntered}
      onPointerLeave={pointerLeft}
      onPointerMove={pointerMoved}
    >
      {popUpBoxText}
      {isVisible === true
        ? <InformationContainer
          x={pointerCoordinates.x}
        >
          {information}
        </InformationContainer>
        : null
      }
    </TriggerContainer>
  )
}

export default InformationPopUpBox