import styled from 'styled-components'
import RadioButton from '../../../Generic/CardTableControls/RadioButton'

const OrderControlsContainer = styled.div`
  ${props => props.theme.components.containers.cardTableControlsElementsRow};
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

const FunctionalityDescriptionText = styled.div`
  ${props => props.theme.components.texts.cardTableControlsNameText};
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
    <OrderControlsContainer>
      <ControlElement>
        <FunctionalityDescriptionText>
          ORDER BY
        </FunctionalityDescriptionText>
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
        <FunctionalityDescriptionText>
          DIRECTION
        </FunctionalityDescriptionText>
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
    </OrderControlsContainer>
  )
}

export default OrderControls