const testCardSets = [
  {
    id: 1,
    name: 'Kaldheim',
    description: 'Set of kaldheim cards',
    date: new Date('2022-09-06T13:39:40.002Z')
  },
  {
    id: 2,
    name: 'Throne of Eldraine',
    description: 'Set of cards from Throne of Eldraine',
    date: new Date('2021-12-24T10:20:12.002Z')
  },
  {
    id: 3,
    name: 'Dominaria',
    description: 'A set of cards from Dominaria',
    date: new Date('2019-03-13T23:44:12.002Z')
  }
]

const cardSets = [
  {
    name: 'Crimson Vow',
    description: 'Set of cards from Crimson Vow'
  },

  {
    name: 'Midnight Hunt',
    description: 'Set of cards from MidnightHunt'
  },
  {
    name: 'Ice Age',
    description: 'An oldschool set of cards'
  }
]

const invalidCardSet = {
  'description': 'An invalid set'
}

module.exports = {
  testCardSets,
  cardSets,
  invalidCardSet
}