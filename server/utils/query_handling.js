const getPlain = (returned) => {
  const plainData = returned[1][0].dataValues

  return plainData
}

module.exports = {
  getPlain
}
