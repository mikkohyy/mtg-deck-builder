import { useEffect, useState } from 'react'
import styled from 'styled-components'

const ControlsRow = styled.div`
  display: flex;
  gap: 0.5em;
  padding: 0.5em;
`

const MinMaxRow = styled.div`
  display: flex;
  gap: 0.5em;
`

const ControlsContainer = styled.div`
  display: flex;
  background: ${props => props.theme.basicPalette.light};
  border-top: solid 1px ${props => props.theme.basicPalette.darkest};
  border-left: solid 1px ${props => props.theme.basicPalette.darkest};
  border-right: solid 1px ${props => props.theme.basicPalette.darkest};
`

const MinMaxValueInput = styled.input`
  width: 2em;
  margin-left: 0.5em  ;
`

const Controls = ({ openedCardSet, setFilteredCards }) => {
  const [searchWord, setSearchWord] = useState('')
  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState('50')

  const cardNameBeginsWith = (card, word) => {
    const lowerCaseSearchWord = word.toLowerCase()
    const lowerCaseCardName = card.name.toLowerCase()
    const beginsWith = lowerCaseCardName.startsWith(lowerCaseSearchWord)

    return beginsWith
  }

  const isMinMaxPrice = (value) => {
    let isPrice = false
    if (value === '0') {
      isPrice = true
    } else {
      // regex accepts e.g. 0.1, 5, 0034 or 12.3 not 0
      const priceRegex = /^([0]\.|[1-9][0-9]*\.?)\d*$/
      isPrice = priceRegex.test(value)
    }

    return isPrice
  }

  const fitsIntoMinMaxPrice = (card) => {
    let fits = false

    const minPriceAsFloat = parseFloat(minPrice)
    const maxPriceAsFloat = parseFloat(maxPrice)

    if (card.price >= minPriceAsFloat && card.price <= maxPriceAsFloat) {
      fits = true
    }

    return fits
  }

  const cardsCanBeFiltered = () => {
    let canBeFiltered = true
    const priceRegex = /^\d+\.?\d*$/

    if (openedCardSet === undefined) {
      canBeFiltered = false
    } else if (priceRegex.test(minPrice) === false) {
      canBeFiltered = false
    } else if (priceRegex.test(maxPrice) === false) {
      canBeFiltered = false
    }

    return canBeFiltered
  }

  useEffect(() => {
    if (cardsCanBeFiltered()) {
      const filteredCardSet = openedCardSet.cards
        .filter(card => cardNameBeginsWith(card, searchWord))
        .filter(card => fitsIntoMinMaxPrice(card))

      setFilteredCards(filteredCardSet)
    }
  }, [searchWord, minPrice, maxPrice])

  const changeSearchWord = (event) => {
    setSearchWord(event.target.value)
  }

  const changeMinPrice = (event) => {
    if ( event.target.value === '' || isMinMaxPrice(event.target.value) === true) {
      setMinPrice(event.target.value)
    }
  }

  const changeMaxPrice = (event) => {
    if ( event.target.value === '' || isMinMaxPrice(event.target.value) === true) {
      setMaxPrice(event.target.value)
    }
  }

  return(
    <ControlsContainer>
      <ControlsRow>
        <label htmlFor='searchField'>Search:</label>
        <input
          value={searchWord}
          onChange={changeSearchWord}
          name='searchField'
          id='searchField'
        />
        <MinMaxRow>
          <div>
            Price
          </div>
          <div>
            <label htmlFor='minPrice'>min:</label>
            <MinMaxValueInput
              value={minPrice}
              onChange={changeMinPrice}
              name='minPrice'
              id='minPrice'
            />
          </div>
          <div>
            <label htmlFor='maxPrice'>max:</label>
            <MinMaxValueInput
              value={maxPrice}
              onChange={changeMaxPrice}
              name='maxPrice'
              id='maxPrice'
            />
          </div>
        </MinMaxRow>
      </ControlsRow>
    </ControlsContainer>
  )
}

export default Controls