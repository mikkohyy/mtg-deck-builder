const bcrypt = require('bcrypt')

const getHashedString = async (string, saltRounds) => {
  const hashedString = await bcrypt.hash(string, saltRounds)

  return hashedString
}



module.exports = { getHashedString }