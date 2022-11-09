import CardSetsTable from './CardSetsTable'
import styled from 'styled-components'

const CardSets = styled.div`
  background-color: #DEF2F1;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1em;
  border: 2px solid;
  border-color: #2B7A78;
  border-radius: 0.2em;

`

const CardSetsList = ({ cardSets, changeActivity }) => {
  return(
    <CardSets>
      <CardSetsTable cardSets={cardSets} />
      <button>Open</button>
      <button onClick={() => changeActivity()}>Close</button>
    </CardSets>
  )
}

export default CardSetsList