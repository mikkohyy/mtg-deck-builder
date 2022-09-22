const extractInformationOnUpdatedObject = (returned) => {
  const plainData = returned[1][0].dataValues

  return plainData
}

module.exports = {
  extractInformationOnUpdatedObject
}
