const usersRouter = require('express').Router()
const { User } = require('../models')
const { getHashedString } = require('../utils/general')
const {
  validateNewUserObject,
  validateUpdatedUserObject,
  validateIdWhichIsInteger
} = require('../utils/middleware')
const { extractInformationOnUpdatedObject } = require('../utils/query_handling')

/**
 * Returned object when a new user is created
 * @typedef {Object} CreatedUser - Created user
 * @property {number} id - Id of the created user
 * @property {string} username - Created username
 */

/**
 * Endpoint for adding a new user. Expects request body to have:
 * @param {string} username
 * @param {string} password
 * @returns {CreatedUser} created user
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

usersRouter.delete('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const userId = request.params.id

  try {
    const deletionInfo = await User.destroy({ where: { id: userId } })
    deletionInfo !== 0 ? response.status(204).send() : response.status(404).send()
  } catch(error) {
    next(error)
  }
})

usersRouter.put(
  '/:id',
  validateIdWhichIsInteger,
  validateUpdatedUserObject,
  async (request, response, next) => {
    const userId = request.params.id

    try {
      const updatedFields = { ...request.body }

      if (updatedFields.password) {
        const hashedPassword = await getHashedString(updatedFields.password, 10)
        updatedFields.password = hashedPassword
      }

      const updateResponse = await User.update({
        ...updatedFields
      },
      {
        where: { id: userId },
        returning: ['id', 'username']
      })

      if (updateResponse[0] !== 0) {
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

module.exports = usersRouter