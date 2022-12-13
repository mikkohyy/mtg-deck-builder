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

    if (cardIsAlrereadyIncluded(state.cards, action.payload.card)) {
      const updatedCard = createCardWithUpdatedN(state.cards, card.id, nOfCards)
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
  } default:
    return state
  }
}

const addOrUpdate = (changes, addedCard) => {
  const which = changes.added.some(card => card.id === addedCard.id) ? 'add' : 'update'

  return which
}

const cardIsAlrereadyIncluded = (cardsArray, payloadCard) => {
  let cardIsInDeck = false

  if (cardsArray.some((card) => card.id === payloadCard.id)) {
    cardIsInDeck = true
  }

  return cardIsInDeck
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

const createCardWithUpdatedN = (cards, addedCardId, changeInN) => {
  const existingCard = cards.find(card => card.id === addedCardId)
  const updatedCard = { ...existingCard, nInDeck: existingCard.nInDeck + changeInN }

  return updatedCard
}

export default createOpenedDeckReducer