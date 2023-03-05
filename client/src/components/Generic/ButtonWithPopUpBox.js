import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  ${props => props.theme.components.buttons.popUpBoxButton.active}
  ${props => props.width !== undefined
    ? { 'width': props.width }
    : undefined}
  :hover {
    ${props => props.theme.components.buttons.popUpBoxButton.hovered}
  }
`

const PopUpBox = styled.div`
  ${props => props.theme.components.containers.popUpBox};
  text-align: left;
  ${props => props.rightSide !== undefined
    ? { 'right': `${props.rightSide}px` }
    : undefined};
`

const ButtonWithPopUpBox = ({
  buttonTextWhenHiddenBox,
  buttonTextWhenVisibleBox,
  boxText,
  cornerPosition = undefined,
  buttonWidth
}) => {
  const [boxIsVisible, setBoxIsVisible] = useState(false)
  const [buttonRightSideValue, setButtonRightSideValue] = useState(undefined)
  const buttonRef = useRef()

  useEffect(() => {
    if (cornerPosition === 'right') {
      const buttonDimensions = buttonRef.current.getBoundingClientRect()
      setButtonRightSideValue(window.innerWidth-buttonDimensions.right)
    }
  }, [])

  return(
    <div>
      <StyledButton
        onClick={() => setBoxIsVisible(!boxIsVisible)}
        width={buttonWidth}
        ref={buttonRef}
      >
        {boxIsVisible === false ? buttonTextWhenHiddenBox : buttonTextWhenVisibleBox}
      </StyledButton>
      {boxIsVisible === true
        ? <PopUpBox rightSide={buttonRightSideValue}>{boxText}</PopUpBox>
        : null}
    </div>
  )
}

export default ButtonWithPopUpBox