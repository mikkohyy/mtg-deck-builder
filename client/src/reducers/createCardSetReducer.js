const createCardSetReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NAME':
    return {
      ...state,
      name: action.payload,
    }
  case 'SET_DESCRIPTION':
    return {
      ...state,
      description: action.payload
    }
  case 'SET_INFORMATION':
    return({
      ...state,
      name: action.payload.name,
      description: action.payload.information,
    })
  case 'SET_FIELD_NAME': {
    const { field, name } = action.payload
    const currentFieldNames = { ...state.fieldNames }
    currentFieldNames[field] = name

    return({
      ...state,
      fieldNames: {
        ...currentFieldNames,
      }
    })
  }
  case 'SET_KEY_NAMES':
    return({
      ...state,
      keyNames: action.payload
    })
  case 'SET_CARDS':
    return({
      ...state,
      cards: action.payload,
    })
  case 'SET_CARDS_AND_KEY_NAMES':
    return({
      ...state,
      cards: action.payload.cards,
      keyNames: action.payload.keyNames
    })
  default:
    return state
  }
}

export default createCardSetReducer