import styled from 'styled-components'

const MainView = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 98%;
  height: 95vh;
  margin: 0 auto;
  border-style: solid;
  border-color: red;
  font-family: "roboto"; 
`

const ControlsRow = styled.div`
  display: flex;
  border-style: solid;
  border-color: green;
  justify-content: space-between;
`

export {
  MainView,
  ControlsRow
}