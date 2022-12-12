const comparisonFunctions = {
  name: (firstCard, secondCard) => compareStrings(firstCard, secondCard, 'name'),
  price: (firstCard, secondCard) => {return firstCard.price - secondCard.price},
  manaCost: (firstCard, secondCard) => compareManaCosts(firstCard, secondCard)
}

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

const compareManaCosts = (firstCard, secondCard) => {
  const firstCardManaCost = getManaCostSum(firstCard.manaSymbols)
  const secondCardManaCost = getManaCostSum(secondCard.manaSymbols)

  return firstCardManaCost - secondCardManaCost
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

export {
  comparisonFunctions
}