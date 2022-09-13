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

module.exports = cardSetsRouter