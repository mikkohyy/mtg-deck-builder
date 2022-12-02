import { useState } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  ${props => props.theme.components.buttons.popUpBoxButton}
  ${props => props.width !== undefined
    ? { 'width': props.width }
    : undefined}
  }
`

const PopUpBox = styled.div`
  ${props => props.theme.components.containers.popUpBox}
  text-align: left;
`

const ButtonWithPopUpBox = ({
  buttonTextWhenHiddenBox,
  buttonTextWhenVisibleBox,
  boxText,
  width
}) => {
  const [boxIsVisible, setBoxIsVisible] = useState(false)
  return(
    <div>
      <StyledButton
        onClick={() => setBoxIsVisible(!boxIsVisible)}
        width={width}
      >
        {boxIsVisible === false ? buttonTextWhenHiddenBox : buttonTextWhenVisibleBox}
      </StyledButton>
      {boxIsVisible === true
        ? <PopUpBox>{boxText}</PopUpBox>
        : null}

    </div>
  )
}
2
export default ButtonWithPopUpBox