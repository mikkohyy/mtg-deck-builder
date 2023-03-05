const createOpenedDeckReducer = (state, action) => {
  switch(action.type) {
  case 'SET_DECK': {
    return({
      ...action.payload
    })
  }
  case 'SET_NAME':
    return {
      ...state,
      name: action.payload.name
    }
  case 'SET_NOTES':
    return {
      ...state,
      notes: action.payload.notes
    }
  case 'SET_DECK_ID':
    return {
      ...state,
      id: action.payload.id
    }
  case 'ADD_CARD': {
    let updatedCards
    let updatedChanges
    const { card, nOfCards } = action.payload

    if (cardIsAlreadyInTheDeck(state.cards, card)) {
      const updatedCard = getCardWithUpdatedN(state.cards, card.id, nOfCards, 'add')
      const typeOfChange = getTypeOfChange(state.changes, action.payload.card)

      updatedCards = state.cards.map(card => card.id === updatedCard.id ? updatedCard : card)
      updatedChanges = updateChanges(state.changes, updatedCard, typeOfChange)
    } else {
      const newCard = {
        ...card,
        nInDeck: nOfCards,
        sideboard: false
      }

      updatedCards = [...state.cards, newCard]
      updatedChanges = {
        added: [...state.changes.added, newCard],
        deleted: [...state.changes.deleted],
        updated: [...state.changes.updated]
      }
    }

    return ({
      ...state,
      cards: updatedCards,
      changes: updatedChanges
    })
  }
  case 'REMOVE_CARD': {
    let modifiedCards
    let modifiedChanges
    const { card, nOfCards } = action.payload
    const updatedCard = getCardWithUpdatedN(state.cards, card.id, nOfCards, 'remove')

    if (isCardNewCard(state.changes.added, card)) {
      modifiedCards = removeCard(state.cards, updatedCard)
      modifiedChanges = removeFromChanges(state.changes, updatedCard)
    } else {
      console.log('this can be implemented only after there is the possibility of adding a deck to the database..')
    }

    return ({
      ...state,
      cards: modifiedCards,
      changes: modifiedChanges
    })
  }

  default:
    return state
  }
}

const getTypeOfChange = (changes, addedCard) => {
  const type = changes.added.some(card => card.id === addedCard.id) ? 'add' : 'update'
  return type
}

const cardIsAlreadyInTheDeck = (cardsArray, payloadCard) => {
  let cardIsInDeck = false

  if (cardsArray.some((card) => card.id === payloadCard.id)) {
    cardIsInDeck = true
  }

  return cardIsInDeck
}

const isCardNewCard = (addedArray, payloadCard) => {
  let cardIsNew = false

  if (addedArray.some((card) => card.id === payloadCard.id)) {
    cardIsNew = true
  }

  return cardIsNew
}

const updateChanges = (changes, modifiedCard, typeOfChange) => {
  const { added, deleted, updated } = changes

  const modifiedChanges = {
    added: typeOfChange === 'add'
      ? added.map(card => card.id === modifiedCard.id ? modifiedCard : card)
      : [...added],
    deleted: typeOfChange === 'delete'
      ? deleted.filter(card => card.id === modifiedCard.id)
      : [...deleted],
    updated: typeOfChange === 'update'
      ? updated.map(card => card.id === modifiedCard.id ? modifiedCard : card)
      : [...updated]
  }

  return modifiedChanges
}

const getCardWithUpdatedN = (cards, addedCardId, changeInN, typeOfChange) => {
  const existingCard = cards.find(card => card.id === addedCardId)
  const updatedNInDeck = typeOfChange === 'add'
    ? existingCard.nInDeck + changeInN
    : existingCard.nInDeck - changeInN

  const updatedCard = { ...existingCard, nInDeck: updatedNInDeck }

  return updatedCard
}

const removeCard = (cards, updatedCard) => {
  let updatedCards

  if (updatedCard.nInDeck < 0) {
    updatedCards = cards.filter(card => card.id !== updatedCard.id)
  } else {
    updatedCards = cards.map(card => card.id === updatedCard.id ? updatedCard : card)
  }

  return updatedCards
}

const removeFromChanges = (changes, updatedCard) => {
  const { added, deleted, updated } = changes
  let updatedAdded

  if (updatedCard.nInDeck < 0) {
    updatedAdded = added.filter(card => card.id !== updatedCard.id)
  } else {
    updatedAdded = added.map(card => card.id === updatedCard.id ? updatedCard : card)
  }


  return {
    added: updatedAdded,
    deleted: deleted,
    updated: updated
  }
}

export default createOpenedDeckReducer