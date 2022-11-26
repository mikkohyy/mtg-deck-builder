import styled from 'styled-components'
import FunctionalitySelectionButton from '../Generic/FunctionalitySelectionButton'

const FunctionalitySelectionContainer = styled.div`
  display: flex;
  gap: 0.3em;
`

const FunctionalitySelection = () => {
  return(
    <FunctionalitySelectionContainer>
      <FunctionalitySelectionButton text='Builder' linkTo='/builder' />
      <FunctionalitySelectionButton text='Tester' linkTo='/tester' />
    </FunctionalitySelectionContainer>
  )
}

export default FunctionalitySelection