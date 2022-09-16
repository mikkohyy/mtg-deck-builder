const cardSetsRouter = require('express').Router()
const { CardSet, Card } = require('../models')
const { getPlain } = require('../utils/query_handling')

cardSetsRouter.get('/', async (request, response) => {
  const foundSets = await CardSet.findAll()
  response.json(foundSets)
})

cardSetsRouter.get('/:id', async (request, response, next) => {
  const setId = request.params.id
  try {
    const foundSet = await CardSet.findOne({
      where: { id: setId },
      include: {
        model: Card
      }
    })

    foundSet ? response.json(foundSet) : response.send(404).end()
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.post('/', async (request, response, next) => {
  try {
    const newSet = { ...request.body, date: new Date() }
    const addedSet = await CardSet.create(newSet)
    response.status(201).json(addedSet)
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.delete('/:id', async (request, response, next) => {
  try {
    const cardSetId = request.params.id
    const rowsDestroyed = await CardSet.destroy({ where: { id: cardSetId } })

    rowsDestroyed ? response.status(204).end() : response.send(404).end()
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.put('/:id', async (request, response, next) => {
  let updatedObject = null
  try {
    const cardSetId = request.params.id
    const { name, description, date } = request.body

    const updatedInfo = await CardSet.update(
      {
        name,
        description,
        date
      },
      {
        where: { id: cardSetId },
        returning: true
      }
    )

    const updatedRows = updatedInfo[0]

    if (updatedRows) {
      updatedObject = getPlain(updatedInfo)
    }

    updatedRows ? response.status(200).json(updatedObject) : response.status(404).end()
  } catch(error) {
    next(error)
  }
})

module.exports = cardSetsRouter