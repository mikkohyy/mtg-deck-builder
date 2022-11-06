const {
  testUsers,
  testCards,
  testCardSets,
  testCardSetsWithId,
  camelCaseTestDeckObjects,
  testCardUpdatesOnDeckWithIdOne,
} = require('./test_data')
const ObjectValidator = require('../utils/object_validator')

describe('ObjectValidator', () => {
  describe('\'User\' object validation', () => {
    describe('when user not in databahse', () => {
      describe('if valid', () => {
        test('returns empty object', () => {
          const expectedInformation = {}

          const data = { ...testUsers[0] }
          const whatIsWrongAboutThisUser = ObjectValidator.checkIfUserObjectIsValid(data, 'newUser')

          expect(whatIsWrongAboutThisUser).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        test('returns expected information', () => {
          const expectedInformation = {
            password: 'MISSING',
            username: 'INVALID',
            extra: 'UNEXPECTED'
          }

          const data = { ...testUsers[0] }
          delete data.password,
          data.username = ['this is invalid']
          data.extra = 'this is extra'

          const whatIsWrongAboutThisUser = ObjectValidator.checkIfUserObjectIsValid(data, 'newUser')

          expect(whatIsWrongAboutThisUser).toEqual(expectedInformation)
        })
      })
    })

    describe('when user is already in database', () => {
      describe('if valid', () => {
        test('returns empty object', () => {
          const expectedInformation = {}

          const data = { ...testUsers[0] }
          delete data.password

          const whatIsWrongAboutThisUser = ObjectValidator.checkIfUserObjectIsValid(data, 'updatedUser')

          expect(whatIsWrongAboutThisUser).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        test('returns exepected information', () => {
          const expectedInformation = {
            username: 'INVALID',
            extra: 'UNEXPECTED'
          }

          const data = { ...testUsers[0] }
          delete data.password
          data.username = { username: 'zerocool' }
          data.extra = 'this is extra'

          const whatIsWrongAboutThisUser = ObjectValidator.checkIfUserObjectIsValid(data, 'updatedUser')

          expect(whatIsWrongAboutThisUser).toEqual(expectedInformation)
        })
      })
    })
  })
  describe('\'Card\' object validation', () => {
    describe('when card is in the context of \'card set\'', () => {
      describe('when card is not in database', () => {
        describe('if valid', () => {
          test('returns empty object', () => {
            const expectedInformation = {}
            const data = { ...testCards[0] }

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'newCard')

            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
        describe('if invalid', () => {
          test('returns returns expected information', () => {
            const expectedInformation = {
              name: 'MISSING',
              cardNumber: 'INVALID',
              extra: 'UNEXPECTED'
            }

            const data = { ...testCards[0] }
            delete data.name
            data.cardNumber = '12.8'
            data.extra = 'this is extra'

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'newCard')

            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
      })
      describe('when card added to an existing \'card set\'', () => {
        describe('if valid', () => {
          test('returns empty object', () => {
            const expectedInformation = {}
            const data = { ...testCards[0], cardSetId: 1 }

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'newCardInCardSet')

            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
        describe('if invalid', () => {
          test('returns returns expected information', () => {
            const expectedInformation = {
              name: 'MISSING',
              cardNumber: 'INVALID',
              extra: 'UNEXPECTED'
            }

            const data = { ...testCards[0], cardSetId: 1 }
            delete data.name
            data.cardNumber = '12.8'
            data.extra = 'this is extra'

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'newCardInCardSet')

            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
      })
      describe('when card exists in the database', () => {
        describe('if valid', () => {
          test('returns empty object', () => {
            const expectedInformation = {}
            const data = { id: 1, cardSetId: 1, ...testCards[0] }

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'updatedCard')

            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
        describe('if invalid', () => {
          test('returns returns expected information', () => {
            const expectedInformation = {
              cardSetId: 'MISSING',
              cardNumber: 'INVALID',
              extra: 'UNEXPECTED'
            }

            const data = { id: 1, ...testCards[0] }
            data.cardNumber = '12.8'
            data.extra = 'this is extra'

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'updatedCard')

            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
      })
    })
    describe('when in the context of \'deck\'', () => {
      describe('if valid', () => {
        test('returns empty object', () => {
          const expectedInformation = {}
          const data = {
            id: 1,
            nInDeck: 4,
            sideboard: true,
            ...testCards[0]
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'partOfDeckCard')

          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        test('returns expected information', () => {
          const expectedInformation = {
            nInDeck: 'MISSING',
            name: 'INVALID',
            extra: 'UNEXPECTED'
          }

          const data = {
            id: 1,
            sideboard: false,
            extra: 'this is extra',
            ...testCards[0],
            name: ['cards name'],
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardObjectIsValid(data, 'partOfDeckCard')

          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
    })
  })
  describe('\'Deck\' object validation', () => {
    describe('when deck is not in database', () => {
      describe('if valid', () => {
        test('returns an empty object when no cards', () => {
          const expectedInformation = {}

          const data = {
            ...camelCaseTestDeckObjects.withoutId,
            cards: {
              added: [],
              deleted: [],
              updated: []
            }
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfDeckObjectIsValid(data, 'newDeck')

          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
        test('returns an empty object when has cards that are valid', () => {
          const { added } = testCardUpdatesOnDeckWithIdOne
          const expectedInformation = {}

          const data = {
            ...camelCaseTestDeckObjects.withoutId,
            cards: {
              added: added.map(card => ({ ...card })),
              deleted: [],
              updated: []
            }
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfDeckObjectIsValid(data, 'newDeck')

          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        describe('when invalid properties', () => {
          test('returns expected information', () => {
            const expectedInformation = {
              notes: 'INVALID',
              name: 'MISSING',
              extra: 'UNEXPECTED',
              cards: 'INVALID'
            }

            const data = {
              ...camelCaseTestDeckObjects.withoutId,
              notes: ['this is invalid'],
              extra: 'this is extra',
              cards: [],
            }

            delete data.name

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfDeckObjectIsValid(data, 'newDeck')
            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
        describe('when invalid cards under card property', () => {
          test('returns expected information', () => {
            const { added } = testCardUpdatesOnDeckWithIdOne

            const expectedInformation = {
              cards: 'INVALID',
              cardObjects: {
                added: [
                  {
                    index: '1',
                    extra: 'UNEXPECTED',
                    price: 'INVALID',
                    cardNumber: 'MISSING'
                  }
                ],
                deleted: [],
                updated: []
              }
            }

            const data = {
              ...camelCaseTestDeckObjects.withoutId,
              cards: {
                added: added.map(card => ({ ...card })),
                deleted: [],
                updated: []
              }
            }

            data.cards.added[1].extra = 'this is extra'
            data.cards.added[1].price = 'this is invalid'
            delete data.cards.added[1].cardNumber

            const whatIsWrongAboutThisCard = ObjectValidator.checkIfDeckObjectIsValid(data, 'newDeck')
            expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
          })
        })
      })
    })
    describe('when deck that is already in database is modified', () => {
      describe('if valid', () => {
        test('returns an empty object', () => {
          const expectedInformation = {}

          const { added, updated, deleted } = testCardUpdatesOnDeckWithIdOne
          const data = {
            ...camelCaseTestDeckObjects.withId,
            cards: {
              added: added.map(card => ({ ...card })),
              deleted: deleted.map(card => ({ ...card })),
              updated: updated.map(card => ({ ...card }))
            }
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfDeckObjectIsValid(data, 'updatedDeck')
          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        test('returns expected information', () => {
          const expectedInformation = {
            id: 'INVALID',
            notes: 'MISSING',
            cards: 'INVALID',
            cardObjects: {
              added: [
                {
                  index: '1',
                  price: 'MISSING'
                }
              ],
              deleted: [
                {
                  index: '0',
                  cardNumber: 'INVALID'
                }
              ],
              updated: [
                {
                  index: '1',
                  extra: 'UNEXPECTED'
                }
              ]
            }
          }

          const { added, updated, deleted } = testCardUpdatesOnDeckWithIdOne
          const data = {
            ...camelCaseTestDeckObjects.withId,
            cards: {
              added: added.map(card => ({ ...card })),
              deleted: deleted.map(card => ({ ...card })),
              updated: updated.map(card => ({ ...card }))
            }
          }

          data.id = 'this is invalid'
          delete data.notes
          delete data.cards.added[1].price
          data.cards.deleted[0].cardNumber = [123]
          data.cards.updated[1].extra = 'this is unnecessar'

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfDeckObjectIsValid(data, 'updatedDeck')
          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
    })
  })
  describe('\'Card Set\' object validations', () => {
    describe('when card set is not in the database', () => {
      describe('if valid', () => {
        test('returns an empty object', () => {
          const expectedInformation = {}

          const data = {
            ...testCardSets[0],
            cards: testCards.map(card => ({ ...card }))
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardSetObjectIsValid(data, 'newCardSet')
          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        test('returns expected information', () => {
          const expectedInformation = {
            name: 'INVALID',
            cards: 'INVALID',
            description: 'MISSING',
            extra: 'UNEXPECTED',
            cardObjects: [
              {
                index: '4',
                cardNumber: 'MISSING'
              },
              {
                index: '7',
                nInDeck: 'UNEXPECTED',
                sideboard: 'UNEXPECTED'
              }
            ]
          }

          const data = {
            ...testCardSets[0],
            cards: testCards.map(card => ({ ...card }))
          }

          data.extra = 'this is unnecessary'
          delete data.description
          data.name = ['this is invalid']

          delete data.cards[4].cardNumber
          data.cards[7].nInDeck = 4
          data.cards[7].sideboard = true

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardSetObjectIsValid(data, 'newCardSet')
          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
    })
    describe('when card set is already in the database', () => {
      describe('if valid', () => {
        test('returns an empty object', () => {
          const expectedInformation = {}

          const data = {
            ...testCardSetsWithId[0],
          }

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardSetObjectIsValid(data, 'updatedCardSet')
          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
      describe('if invalid', () => {
        test('returns expected information', () => {
          const expectedInformation = {
            date: 'MISSING',
            extra: 'UNEXPECTED',
            name: 'INVALID'
          }

          const data = {
            ...testCardSetsWithId[0],
            extra: 'this is unexpected',
            name: ['this is invalid']
          }

          delete data.date

          const whatIsWrongAboutThisCard = ObjectValidator.checkIfCardSetObjectIsValid(data, 'updatedCardSet')
          expect(whatIsWrongAboutThisCard).toEqual(expectedInformation)
        })
      })
    })
  })
})