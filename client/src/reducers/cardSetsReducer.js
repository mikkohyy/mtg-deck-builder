const cardSetsReducer = (state, action) => {
  switch (action.type) {
  case 'SET_CARD_SET_LIST':
    return action.payload
  case 'ADD_CARD_SET': {
    const newCardSet = action.payload
    return ([
      ...state,
      newCardSet
    ])
  }
  case 'DELETE_CARD_SET': {
    const deletedCardSetId = action.payload.id
    const filteredCardSets = state.filter((cardSet) => cardSet.id !== deletedCardSetId)
    return filteredCardSets
  }
  default:
    return state
  }
}

export default cardSetsReducer