import styled from 'styled-components'
import CheckBox from '../../../Generic/CardTableControls/CheckBox'

const TypeFiltersContainer = styled.div`
  ${props => props.theme.components.containers.cardTableControlsElementsColumn};
`

const UpperRow = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
`

const Text = styled.div`
  ${props => props.theme.components.texts.cardTableControlsNameText}
`

const Filters = styled.div`
  display: flex;
  gap: 0.5em;
`

const MassSelectionButton = styled.button`
  background: ${props => props.theme.basicPalette.medium};
  border: solid 1px ${props => props.theme.basicPalette.darkest};
  border-radius: ${props => props.theme.components.buttons.corners};
  &:hover {
    background: ${props => props.theme.basicPalette.darker};
    cursor: pointer;
  }
`

const MassSelectionButtonText = styled.div`
  font-size: 0.8em;
  font-weight: 600;
  margin: auto;
`

const TypeFilterControls = ({ selectedTypes, setSelectedTypes }) => {
  const handleTypeFilterChange = (color) => {
    const selectedTypesCopy = { ...selectedTypes }
    selectedTypesCopy[color] = !selectedTypes[color]
    setSelectedTypes({ ...selectedTypesCopy })
  }

  const createNewTypesObject = (value) => {
    const updatedTypes = {}

    for (const key of Object.keys(selectedTypes)) {
      updatedTypes[key] = value
    }

    return updatedTypes
  }

  const setAllTypes = (value) => {
    setSelectedTypes(createNewTypesObject(value))
  }

  return(
    <TypeFiltersContainer>
      <UpperRow>
        <Text>
          SHOW
        </Text>
        <MassSelectionButton onClick={() => setAllTypes(true)}>
          <MassSelectionButtonText>
            ALL
          </MassSelectionButtonText>
        </MassSelectionButton>
        <MassSelectionButton onClick={() => setAllTypes(false)}>
          <MassSelectionButtonText>
            NONE
          </MassSelectionButtonText>
        </MassSelectionButton>
      </UpperRow>
      <Filters>
        <CheckBox
          name='blackCheckbox'
          type='black'
          label='Black'
          checked={selectedTypes.black === true}
          handleChange={handleTypeFilterChange}
        />
        <CheckBox
          name='blueCheckbox'
          type='blue'
          label='Blue'
          checked={selectedTypes.blue === true}
          handleChange={handleTypeFilterChange}
        />
        <CheckBox
          name='greenCheckbox'
          type='green'
          label='Green'
          checked={selectedTypes.green === true}
          handleChange={handleTypeFilterChange}
        />
        <CheckBox
          name='redColor'
          type='red'
          label='Red'
          checked={selectedTypes.red === true}
          handleChange={handleTypeFilterChange}
        />
        <CheckBox
          name='whiteColor'
          type ='white'
          label='White'
          checked={selectedTypes.white === true}
          handleChange={handleTypeFilterChange}
        />
        <CheckBox
          name='colorlessColor'
          type='colorless'
          label='Colorless'
          checked={selectedTypes.colorless === true}
          handleChange={handleTypeFilterChange}
        />
        <CheckBox
          name='landCards'
          type='land'
          label='Land'
          checked={selectedTypes.land === true}
          handleChange={handleTypeFilterChange}
        />
      </Filters>
    </TypeFiltersContainer>
  )
}

export default TypeFilterControls