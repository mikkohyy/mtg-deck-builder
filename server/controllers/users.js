const usersRouter = require('express').Router()
const { User } = require('../models')
const { getHashedString } = require('../utils/general')
const {
  validateNewUserObject,
  validateUpdatedUserObject,
  validateIdWhichIsInteger
} = require('../utils/validation_middleware')
const { extractInformationOnUpdatedObject } = require('../utils/query_handling')

const HASH_ROUNDS = 10

/**
 * The object containing information about user
 * @typedef {Object} User - Information about user
 * @property {number} id - Id of the created user
 * @property {string} username - Created username
 */

/**
 * Endpoint for adding a new user. Expects request body to have:
 * @param {string} username
 * @param {string} password
 * @returns {User} created user as the body of the response
 */
usersRouter.post('/', validateNewUserObject, async (request, response, next) => {
  try {
    const receivedUserData = request.body
    const hashedPassword = await getHashedString(receivedUserData.password, 10)

    const newAddedUser = await User
      .create({ ...receivedUserData, password: hashedPassword })

    const userWithoutPassword = {
      id: newAddedUser.id,
      username: newAddedUser.username
    }

    response.status(201).json(userWithoutPassword)
  } catch(error) {
    next(error)
  }
})

/**
 * Endpoint for deleting user defined by id that is given as parameter
 */
usersRouter.delete('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const userId = request.params.id

  try {
    const deletionInfo = await User.destroy({ where: { id: userId } })
    deletionInfo !== 0 ? response.status(204).send() : response.status(404).send()
  } catch(error) {
    next(error)
  }
})

/**
 * Endpoind for updating user defined by id that is given as parameter
 * expects an object with the following propertie:
 * @param {string} username (optional)
 * @param {string} password (optional)
 * @returns {User} created user as the body of the response
 */
usersRouter.put(
  '/:id',
  validateIdWhichIsInteger,
  validateUpdatedUserObject,
  async (request, response, next) => {
    const userId = request.params.id

    try {
      let updatedFields = { ...request.body }

      updatedFields = await ifPasswordHashIt(updatedFields)
      const updateResponse = await updateUserInDatabase(updatedFields, userId)

      if (wasUserUpdated(updateResponse) === true) {
        const updatedUser = extractInformationOnUpdatedObject(updateResponse)
        response.status(200).json(updatedUser)
      } else {
        response.status(404).end()
      }

    } catch(error) {
      next(error)
    }
  }
)

/**
 * Checks if object has property password and if it has, hashes it
 * @param {object} updatedFields
 * @returns {object} input object with hashed password if property existed
 */
const ifPasswordHashIt = async(updatedFields) => {
  if (updatedFields.password) {
    const hashedPassword = await getHashedString(updatedFields.password, HASH_ROUNDS)
    updatedFields.password = hashedPassword
  }
  return updatedFields
}


/**
 * Updates user whose id is given as parameter
 * @param {object} updatedFields object containing the colums that should be updated
 * @param {number} userId id of the user
 * @returns {[{number}, {object}]} response to the update-request
 */
const updateUserInDatabase = async(updatedFields, userId) => {
  const updateResponse = await User.update({
    ...updatedFields
  },
  {
    where: { id: userId },
    returning: ['id', 'username']
  })

  return updateResponse
}

/**
 * Checks from update-request if a user was updated
 * @param {[{number}, {object}]} updateResponse reponse object from update-request
 * @returns {boolean}
 */
const wasUserUpdated = (updateResponse) => {
  let wasUpdated = false
  if (updateResponse[0] !== 0) {
    wasUpdated = true
  }

  return wasUpdated
}

module.exports = usersRouter