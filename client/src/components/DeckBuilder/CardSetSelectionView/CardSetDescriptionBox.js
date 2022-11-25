import styled from 'styled-components'

const DescriptionBox = styled.div`
  position: fixed;
  border: 1px solid;
  max-width: 50em;
  background: #ECF3F3;
  font-size: 0.9em;
  padding: 0.8em;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`

const CardSetDescriptionBox = ({ description, top, left }) => {
  return(
    <DescriptionBox top={top} left={left}>
      {description}
    </DescriptionBox>
  )
}

export default CardSetDescriptionBox