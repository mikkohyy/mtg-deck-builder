import { useState } from 'react'
import styled from 'styled-components'
import FunctionalityNavButton from '../../Generic/FunctionalityNavButton'
import ButtonGroup from '../../Generic/ButtonGroup'
import SelectCardSetButtonAndTable from './SelectCardSetButtonAndTable'
import AddCardSetButtonAndWindow from './AddCardSetButtonAndWindow'

const ButtonContainer = styled.div`
  padding: ${props => props.theme.margins.navigationBars};
  display: flex;
  justify-content: space-between;
  background: ${props => props.theme.basicPalette.medium};
`

const NavigationBar = () => {
  const [activeSubWindow, setActiveSubWindow] = useState(undefined)

  return(
    <ButtonContainer>
      <ButtonGroup>
        <SelectCardSetButtonAndTable
          activeSubWindow={activeSubWindow}
          setActiveSubWindow={setActiveSubWindow}
        />
        <AddCardSetButtonAndWindow
          activeSubWindow={activeSubWindow}
          setActiveSubWindow={setActiveSubWindow}
        />
        <FunctionalityNavButton text='Edit card set' />
      </ButtonGroup>
      <ButtonGroup>
        <FunctionalityNavButton text='Save deck' />
        <FunctionalityNavButton text='Open deck' />
      </ButtonGroup>
    </ButtonContainer>
  )
}

export default NavigationBar