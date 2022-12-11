import { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrderControls from './OrderControls'
import SearchAndPriceControls from './SearchAndPriceControls'

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.basicPalette.light};
  border-top: solid 1px ${props => props.theme.basicPalette.darkest};
  border-left: solid 1px ${props => props.theme.basicPalette.darkest};
  border-right: solid 1px ${props => props.theme.basicPalette.darkest};
  padding: 1em;
  gap: 1em;
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

  return(
    <ControlsContainer>
      <SearchAndPriceControls
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />
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