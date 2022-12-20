const sharedUserObjectPropertyNames = [
  'username',
]

const userObjectPropertyNames = {
  newUser: [ ...sharedUserObjectPropertyNames, 'password' ],
  updatedUser: [ ...sharedUserObjectPropertyNames, 'password' ],
  requiredInUpdate: []
}

const sharedCardObjectPropertyNames = [
  'name',
  'cardNumber',
  'manaCost',
  'rulesText',
  'price',
  'rarity'
]

const cardObjectPropertyNames = {
  newCard: [ ...sharedCardObjectPropertyNames ],
  newCardInCardSet: [ ...sharedCardObjectPropertyNames, 'cardSetId' ],
  updatedCard: [
    'id',
    'cardSetId',
    ...sharedCardObjectPropertyNames
  ],
  partOfDeckCard: [
    'id',
    'nInDeck',
    'sideboard',
    ...sharedCardObjectPropertyNames
  ]
}

const sharedDeckObjectPropertyNames = [
  'name',
  'notes'
]

const deckObjectPropertyNames = {
  newDeck: [ ...sharedDeckObjectPropertyNames, 'cards' ],
  updatedDeckInformation: [ ...sharedCardObjectPropertyNames, 'id'],
  updatedDeck: [ ...sharedDeckObjectPropertyNames, 'cards', 'id' ],
  requiredInUpdate: []
}

const sharedCardSetObjectPropertyNames = [
  'name',
  'description'
]

const cardSetObjectPropertyNames = {
  newCardSet: [ ...sharedCardSetObjectPropertyNames, 'cards' ],
  updatedCardSet: [ ...sharedCardSetObjectPropertyNames, 'id', 'date' ]
}

module.exports = {
  userObjectPropertyNames,
  cardObjectPropertyNames,
  deckObjectPropertyNames,
  cardSetObjectPropertyNames
}