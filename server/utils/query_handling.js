const extractInformationOnUpdatedObject = (returned) => {
  const plainData = returned[1][0].dataValues

  return plainData
}

const extractFoundDataFromQuery = (queryResults) => {
  const deckData = queryResults.get({ plain: true })

  return deckData
}


module.exports = {
  extractInformationOnUpdatedObject,
  extractFoundDataFromQuery
}
