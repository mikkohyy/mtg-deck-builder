const createOpenedDeckReducer = (state, action) => {
  switch(action.type) {
  case 'SET_DECK': {
    return({
      ...action.payload
    })
  }
  case 'ADD_CARD': {
    let modifiedCards
    let modifiedChanges
    const { card, nOfCards } = action.payload

    if (cardIsAlreadyIncluded(state.cards, action.payload.card)) {
      const updatedCard = createCardWithUpdatedN(state.cards, card.id, nOfCards, 'add')
      const typeOfChange = addOrUpdate(state.changes, action.payload.card)

      modifiedCards = state.cards.map(card => card.id === updatedCard.id ? updatedCard : card)
      modifiedChanges = typeOfChange === 'add'
        ? setChanges(state.changes, updatedCard, 'add')
        : setChanges(state.changes, updatedCard, 'update')

    } else {
      const addedCard = {
        ...action.payload.card,
        nInDeck: action.payload.nOfCards,
        sideboard: false
      }

      modifiedCards = [...state.cards, addedCard]
      modifiedChanges = {
        added: [ ...state.changes.added, addedCard],
        deleted: [...state.changes.deleted],
        updated: [...state.changes.updated]
      }
    }

    return ({
      cards: modifiedCards,
      changes: modifiedChanges
    })
  }
  case 'REMOVE_CARD': {
    let modifiedCards
    let modifiedChanges
    const { card, nOfCards } = action.payload

    const updatedCard = createCardWithUpdatedN(state.cards, card.id, nOfCards, 'remove')

    if (isCardNewCard(state.changes.added, card)) {
      modifiedCards = removeCard(state.cards, updatedCard)
      modifiedChanges = removeFromChanges(state.changes, updatedCard)
    } else {
      console.log('oldie')
    }

    return ({
      cards: modifiedCards,
      changes: modifiedChanges
    })
  }

  default:
    return state
  }
}

const addOrUpdate = (changes, addedCard) => {
  const which = changes.added.some(card => card.id === addedCard.id) ? 'add' : 'update'

  return which
}

const cardIsAlreadyIncluded = (cardsArray, payloadCard) => {
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

const setChanges = (changes, modifiedCard, typeOfChange) => {
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

const createCardWithUpdatedN = (cards, addedCardId, changeInN, typeOfChange) => {
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