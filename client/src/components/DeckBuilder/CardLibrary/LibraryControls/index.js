import { useEffect, useState } from 'react'
import styled from 'styled-components'

const ControlsContainer = styled.div`
  display: flex;
  background: ${props => props.theme.basicPalette.light};
  border-top: solid 1px ${props => props.theme.basicPalette.darkest};
  border-left: solid 1px ${props => props.theme.basicPalette.darkest};
  border-right: solid 1px ${props => props.theme.basicPalette.darkest};
  padding: 0.5em;
`

const StyledLabel = styled.div`
  padding-right: 0.5em;
`

const Controls = ({ openedCardSet, setFilteredCards }) => {
  const [searchWord, setSearchWord] = useState('')

  const cardNameBeginsWith = (card, word) => {
    const lowerCaseSearchWord = word.toLowerCase()
    const lowerCaseCardName = card.name.toLowerCase()
    const beginsWith = lowerCaseCardName.startsWith(lowerCaseSearchWord)

    return beginsWith
  }

  useEffect(() => {
    if (openedCardSet !== undefined) {
      const filteredCardSet = openedCardSet.cards
        .filter(card => cardNameBeginsWith(card, searchWord))

      setFilteredCards(filteredCardSet)
    }
  }, [searchWord])

  const changeSearchWord = (event) => {
    setSearchWord(event.target.value)
  }

  return(
    <ControlsContainer>
      <StyledLabel htmlFor='searchField'>Search: </StyledLabel>
      <input
        value={searchWord}
        onChange={changeSearchWord}
        name='searchField'
        id='searchField'
      />
    </ControlsContainer>
  )
}

export default Controls