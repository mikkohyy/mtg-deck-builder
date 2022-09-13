const cardSetsRouter = require('express').Router()
const { CardSet } = require('../models')

cardSetsRouter.get('/', async (request, response) => {
  const foundSets = await CardSet.findAll()
  response.json(foundSets)
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

module.exports = cardSetsRouter