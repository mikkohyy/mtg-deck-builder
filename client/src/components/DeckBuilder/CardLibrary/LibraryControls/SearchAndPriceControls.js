import styled from 'styled-components'

const MainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1em;
`

const SearchFieldDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const PriceRangeControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const MinMaxPricesRow = styled.div`
  display: flex;
  gap: 0.5em;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`

const PriceInput = styled.input`
  width: 2em;
  padding: 0.5em;
`

const SearchInput = styled.input`
  padding: 0.5em;
`

const Label = styled.label`
  font-weight: 600;
  font-size: 0.7em;
`

const WeightedText = styled.div`
  font-weight: 600;
  font-size: 0.7em;
`

const SearchAndPriceControls = ({
  searchWord,
  setSearchWord,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice
}) => {

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

  const handleSearchWordChange = (event) => {
    setSearchWord(event.target.value)
  }

  const handleMinPriceChange = (event) => {
    if ( event.target.value === '' || isMinMaxPrice(event.target.value) === true) {
      setMinPrice(event.target.value)
    }
  }

  const handleMaxPriceChange = (event) => {
    if ( event.target.value === '' || isMinMaxPrice(event.target.value) === true) {
      setMaxPrice(event.target.value)
    }
  }

  return(
    <MainContainer>
      <SearchFieldDiv>
        <Label htmlFor='searchField'>SEARCH</Label>
        <SearchInput
          value={searchWord}
          onChange={handleSearchWordChange}
          name='searchField'
          id='searchField'
        />
      </SearchFieldDiv>
      <PriceRangeControlsContainer>
        <WeightedText>PRICE</WeightedText>
        <MinMaxPricesRow>
          <PriceContainer>
            <Label htmlFor='minPrice'>MIN</Label>
            <PriceInput
              value={minPrice}
              onChange={handleMinPriceChange}
              name='minPrice'
              id='minPrice'
            />
          </PriceContainer>
          <PriceContainer>
            <Label htmlFor='maxPrice'>MAX</Label>
            <PriceInput
              value={maxPrice}
              onChange={handleMaxPriceChange}
              name='maxPrice'
              id='maxPrice'
            />
          </PriceContainer>
        </MinMaxPricesRow>
      </PriceRangeControlsContainer>
    </MainContainer>
  )
}

export default SearchAndPriceControls