import styled from 'styled-components'

const RadioButtonGroup = styled.div`
  display: flex;
  gap: 0.5em;
  padding: 0.5em;
`

const OrderControls = ({ orderBy, setOrderBy }) => {
  const handleNameToggle = () => {
    setOrderBy('name')
  }

  const handleManaCostToggle = () => {
    setOrderBy('manaCost')
  }

  const handlePriceToggle = () => {
    setOrderBy('price')
  }

  return(
    <RadioButtonGroup>
      <label htmlFor='orderByName'>Name</label>
      <input
        type="radio"
        checked={orderBy === 'name'}
        onChange={handleNameToggle}
        name='orderByName'
        id='orderByName'
      />
      <label htmlFor='orderByManaCost'>Mana cost</label>
      <input
        type="radio"
        checked={orderBy === 'manaCost'}
        onChange={handleManaCostToggle}
        name='orderByManaCost'
        id='orderByManaCost'
      />
      <label htmlFor='orderByPrice'>Price</label>
      <input
        type="radio"
        checked={orderBy === 'price'}
        onChange={handlePriceToggle}
        name='orderByPrice'
        id='orderByPrice'
      />
    </RadioButtonGroup>
  )
}

export default OrderControls