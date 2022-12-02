import styled from 'styled-components'

const GappedDiv = styled.div`
  display: flex;
  gap: ${props => props.theme.components.buttons.gapBetween};
`

const ButtonGroup = ({ children }) => {
  return(
    <GappedDiv>
      {children}
    </GappedDiv>
  )
}

export default ButtonGroup