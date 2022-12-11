import { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrderControls from './OrderControls'

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
  flex-direction: column;
  background: ${props => props.theme.basicPalette.light};
  border-top: solid 1px ${props => props.theme.basicPalette.darkest};
  border-left: solid 1px ${props => props.theme.basicPalette.darkest};
  border-right: solid 1px ${props => props.theme.basicPalette.darkest};
`

const SearchInput = styled.input`
  padding: 0.5em;
  margin-left: 0.5em;
`

const MinMaxValueInput = styled.input`
  width: 2em;
  margin-left: 0.5em;
  padding: 0.5em;
`

const InputDiv = styled.div`
  display: flex;
  align-items: center;
`

const PaddedText = styled.div`
  padding: 0.5em;
`

const Controls = ({ openedCardSet, setFilteredCards }) => {
  const [searchWord, setSearchWord] = useState('')
  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState('50')
  const [orderBy, setOrderBy] = useState('name')
  const [orderDirection, setOrderDirection] = useState('ascending')

  const compareStrings = (firstCard, secondCard, property) => {
    let result = 0

    const firstValue = firstCard[property].toLowerCase()
    const secondValue = secondCard[property].toLowerCase()

    if (firstValue < secondValue) {
      result = -1
    } else if (firstValue > secondValue) {
      result = 1
    }

    return result
  }

  const getManaCostSum = (manaSymbols) => {
    let manaCostSum = 0

    if (manaSymbols.length !== 0) {
      for (const symbol of manaSymbols) {
        const symbolAsNumber = Number(symbol)
        if (isNaN(symbolAsNumber)) {
          manaCostSum = manaCostSum + 1
        } else {
          manaCostSum = manaCostSum + symbolAsNumber
        }
      }
    }

    return manaCostSum
  }

  const compareManaCosts = (firstCard, secondCard) => {
    const firstCardManaCost = getManaCostSum(firstCard.manaSymbols)
    const secondCardManaCost = getManaCostSum(secondCard.manaSymbols)

    return firstCardManaCost - secondCardManaCost
  }


  const comparisonFunctions = {
    name: (firstCard, secondCard) => compareStrings(firstCard, secondCard, 'name'),
    price: (firstCard, secondCard) => {return firstCard.price - secondCard.price},
    manaCost: (firstCard, secondCard) => compareManaCosts(firstCard, secondCard)
  }

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
    // Regex accepts e.g. 12, 0.3 and 003 but not 0.
    const priceRegex = /^(\d*\.{1}\d*|\d*)$/

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
        .sort((firstCard, secondCard) => comparisonFunctions[orderBy](firstCard, secondCard))

      setFilteredCards(orderDirection === 'ascending' ? filteredCardSet : filteredCardSet.reverse())
    }
  }, [searchWord, minPrice, maxPrice, orderBy, orderDirection])

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
        <InputDiv>
          <label htmlFor='searchField'>Search:</label>
          <SearchInput
            value={searchWord}
            onChange={changeSearchWord}
            name='searchField'
            id='searchField'
          />
        </InputDiv>
        <MinMaxRow>
          <PaddedText>
            Price
          </PaddedText>
          <InputDiv>
            <label htmlFor='minPrice'>min:</label>
            <MinMaxValueInput
              value={minPrice}
              onChange={changeMinPrice}
              name='minPrice'
              id='minPrice'
            />
          </InputDiv>
          <InputDiv>
            <label htmlFor='maxPrice'>max:</label>
            <MinMaxValueInput
              value={maxPrice}
              onChange={changeMaxPrice}
              name='maxPrice'
              id='maxPrice'
            />
          </InputDiv>
        </MinMaxRow>
      </ControlsRow>
      <OrderControls
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        orderDirection={orderDirection}
        setOrderDirection={setOrderDirection}
      />
    </ControlsContainer>
  )
}

export default Controls