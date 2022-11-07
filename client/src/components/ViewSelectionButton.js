import styled from 'styled-components'

const SelectionButton = styled.button`
  font-size: 1.2em;
  padding: 0.3em;
  border-radius: 0.5em;
  margin: 0.1em 0.2em 0.1em 0.2em;
`

const ViewSelectionButton = ({ text }) => {
  return(
    <SelectionButton>
      {text}
    </SelectionButton>
  )
}

export default ViewSelectionButton