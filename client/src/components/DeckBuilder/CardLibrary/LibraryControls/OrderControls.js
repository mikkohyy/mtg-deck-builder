import styled from 'styled-components'
import RadioButton from '../../../Generic/Buttons/RadioButton'

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1em;
`

const ControlElement = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const RadioButtonGroup = styled.div`
  display: flex;
  gap: 0.5em;
`

const Label = styled.div`
  font-size: 0.7em;
  font-weight: 600;
`

const OrderControls = ({ orderBy, setOrderBy, orderDirection, setOrderDirection }) => {
  const handleNameToggle = () => {
    setOrderBy('name')
  }

  const handleManaCostToggle = () => {
    setOrderBy('manaCost')
  }

  const handlePriceToggle = () => {
    setOrderBy('price')
  }

  const handleAscendingOrderToggle = () => {
    setOrderDirection('ascending')
  }

  const handleDescendingOrderToggle = () => {
    setOrderDirection('descending')
  }

  return(
    <ControlsContainer>
      <ControlElement>
        <Label>
          ORDER BY
        </Label>
        <RadioButtonGroup>
          <RadioButton
            label='Name'
            onChange={handleNameToggle}
            name='orderByName'
            checked={orderBy === 'name'}
          />
          <RadioButton
            label='Mana cost'
            onChange={handleManaCostToggle}
            name='orderByManaCost'
            checked={orderBy === 'manaCost'}
          />
          <RadioButton
            label='Price'
            onChange={handlePriceToggle}
            name='orderByPrice'
            checked={orderBy === 'price'}
          />
        </RadioButtonGroup>
      </ControlElement>
      <ControlElement>
        <Label>
          DIRECTION
        </Label>
        <RadioButtonGroup>
          <RadioButton
            label='Ascending'
            onChange={handleAscendingOrderToggle}
            name='ascendingOrder'
            checked={orderDirection === 'ascending'}
          />
          <RadioButton
            label='Descending'
            onChange={handleDescendingOrderToggle}
            name='descendingOrder'
            checked={orderDirection === 'descending'}
          />
        </RadioButtonGroup>
      </ControlElement>
    </ControlsContainer>
  )
}

export default OrderControls