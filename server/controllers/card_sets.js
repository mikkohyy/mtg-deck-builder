const cardSetsRouter = require('express').Router()
const { CardSet } = require('../models')

cardSetsRouter.get('/', async (request, response) => {
  const foundSets = await CardSet.findAll()
  response.json(foundSets)
})

module.exports = cardSetsRouter