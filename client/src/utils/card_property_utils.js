const manaSymbolTable = {
  'black': 'B',
  'blue': 'U',
  'green': 'G',
  'red': 'R',
  'white': 'W'
}

const possibleColors = ['black', 'blue', 'green', 'red', 'white']

const getCardsWithCardColorAndManaSymbols = (cards) => {
  const modifiedCards = cards
    .map(card => (
      { ...card,
        cardColor: getCardColor(card),
        manaSymbols: getManaSymbols(card)
      }))

  return modifiedCards
}

const getCardColor = (card) => {
  const manaCostArray = card.manaCost.split(' ')
  let cardColor
  let cardColors

  if (hasNoManaCost(manaCostArray) === true) {
    cardColor = 'land'
  } else {
    cardColors = getManaColors(manaCostArray)
    cardColor = defineCardColor(cardColors)
  }

  return cardColor
}

const getManaSymbols = (card) => {
  const manaCostArray = card.manaCost.split(' ')
  const manaSymbols = []

  for (const element of manaCostArray) {
    if (possibleColors.includes(element)) {
      manaSymbols.push(manaSymbolTable[element])
    } else if (element !== '') {
      manaSymbols.push(element.toUpperCase())
    }
  }

  return manaSymbols
}

const hasNoManaCost = (manaCostArray) => {
  let noManaCost = false

  if (manaCostArray.length === 1 && manaCostArray[0] === '') {
    noManaCost = true
  }

  return noManaCost
}

const getManaColors = (manaCostArray) => {
  const cardColors = new Set()

  for (const element of manaCostArray) {
    if (possibleColors.includes(element)) {
      cardColors.add(element)
    }

    if (possibleColors > 1) {
      break
    }
  }

  return cardColors
}

const defineCardColor = (cardColors) => {
  let cardColor

  if (cardColors.size === 1) {
    const cardColorsSetAsArray = Array.from(cardColors)
    cardColor = cardColorsSetAsArray[0]
  } else if (cardColors.size > 1) {
    cardColor = 'multicolor'
  } else if (cardColors.size === 0) {
    cardColor = 'colorless'
  }

  return cardColor
}

const transformCardTextToArray = (card) => {
  const rulesTextAsArray = card.rulesText.split('\n')
  const rulesTextWithoutEmptyLines = rulesTextAsArray.filter(row => row !== '')

  return rulesTextWithoutEmptyLines
}

export {
  getCardColor,
  getManaSymbols,
  transformCardTextToArray,
  getCardsWithCardColorAndManaSymbols
}