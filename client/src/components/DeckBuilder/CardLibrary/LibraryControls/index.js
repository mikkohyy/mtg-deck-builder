import { useEffect, useState } from 'react'
import styled from 'styled-components'
import OrderControls from './OrderControls'
import SearchAndPriceControls from './SearchAndPriceControls'
import TypeFilterControls from './TypeFilterControls'
import { comparisonFunctions } from '../../../../utils/comparison_utils'

const ControlsContainer = styled.div`
  ${props => props.theme.components.containers.cardTableControls}
`

const Controls = ({ openedCardSet, setFilteredCards }) => {
  const [searchWord, setSearchWord] = useState('')
  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState('50')
  const [orderBy, setOrderBy] = useState('name')
  const [orderDirection, setOrderDirection] = useState('ascending')
  const [selectedTypes, setSelectedTypes] = useState({
    colorless: true,
    black: true,
    blue: true,
    green: true,
    red: true,
    white: true,
    land: true,
  })

  const areCardColorsSelected = (card) => {
    let areSelected = true
    const manaCostAsArray = card.manaCost.split(' ')

    for (const cost of manaCostAsArray) {
      if (isNaN(Number(cost)) === true && cost !== 'x') {
        if (selectedTypes[cost] === false) {
          areSelected = false
          break
        }
      }
    }

    return areSelected
  }

  const isTypeSelected = (card) => {
    let isSelected = false

    if (card.cardColor === 'land') {
      isSelected = selectedTypes.land === true
        ? true
        : false
    } else if (card.cardColor === 'multicolor') {
      isSelected = areCardColorsSelected(card)
    } else {
      if (selectedTypes[card.cardColor] === true) {
        isSelected = true
      }
    }

    return isSelected
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
        .filter(card => isTypeSelected(card))
        .filter(card => cardNameBeginsWith(card, searchWord))
        .filter(card => fitsIntoMinMaxPrice(card))
        .sort((firstCard, secondCard) => comparisonFunctions[orderBy](firstCard, secondCard))

      setFilteredCards(orderDirection === 'ascending' ? filteredCardSet : filteredCardSet.reverse())
    }
  }, [searchWord, minPrice, maxPrice, orderBy, orderDirection, selectedTypes])

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
      <TypeFilterControls selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
    </ControlsContainer>
  )
}

export default Controls