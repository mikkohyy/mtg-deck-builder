import styled from 'styled-components'

const CardSets = styled.div`
  height: 40%;
  width: 40%;
  background-color: yellow;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CardSetsList = ({ cardSets }) => {
  return(
    <CardSets>
      {cardSets.map(cardSet => `${cardSet.name} -- ${cardSet.description}`)}
    </CardSets>
  )
}

export default CardSetsList