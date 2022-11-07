import styled from 'styled-components'
import ViewSelectionButton from './ViewSelectionButton'

const ControlsRowFlexbox = styled.div`
  display: flex;
`
const ControlsRow = () => {
  return(
    <ControlsRowFlexbox>
      <ViewSelectionButton text='Builder' />
      <ViewSelectionButton text='Tester' />
    </ControlsRowFlexbox>
  )
}

export default ControlsRow