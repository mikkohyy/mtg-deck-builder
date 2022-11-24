const hasCharacters = (string) => {
  let charactersExist = true

  if (string.trim().length === 0) {
    charactersExist = false
  }

  return charactersExist
}

export {
  hasCharacters
}