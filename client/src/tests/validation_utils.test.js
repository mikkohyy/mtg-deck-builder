import {
  validateString,
  validateInteger,
  validateNumber,
  validateRarityClass,
  validateManaCost
} from '../utils/validation_utils'

describe('validateString(data)', () => {
  describe('returns true', () => {
    test('when string', () => {
      const validationResult = validateString('Grizzly Bears')
      expect(validationResult).toBe(true)
    })
  })
  describe('returns false', () => {
    test('when array', () => {
      const validationResult = validateString(['Grizzly Bears'])
      expect(validationResult).toBe(false)
    })
    test('when an object', () => {
      const validationResult = validateString({ 'Grizzly': 'Bears' })
      expect(validationResult).toBe(false)
    })
    test('when a integer', () => {
      const validationResult = validateString(5)
      expect(validationResult).toBe(false)
    })
    test('when a float', () => {
      const validationResult = validateString(5.245)
      expect(validationResult).toBe(false)
    })
    test('when undefined', () => {
      const validationResult = validateString(undefined)
      expect(validationResult).toBe(false)
    })
    test('when boolean', () => {
      const validationResult = validateString(false)
      expect(validationResult).toBe(false)
    })
  })
})

describe('validateInteger(data)', () => {
  describe('returns true', () => {
    test('when an integer', () => {
      const validationResult = validateInteger(2)
      expect(validationResult).toBe(true)
    })
  })

  describe('returns false', () => {
    test('when array', () => {
      const validationResult = validateInteger(['Grizzly Bears'])
      expect(validationResult).toBe(false)
    })
    test('when an object', () => {
      const validationResult = validateInteger({ 'Grizzly': 'Bears' })
      expect(validationResult).toBe(false)
    })
    test('when a string', () => {
      const validationResult = validateInteger('5')
      expect(validationResult).toBe(false)
    })
    test('when a float', () => {
      const validationResult = validateInteger(5.245)
      expect(validationResult).toBe(false)
    })
    test('when undefined', () => {
      const validationResult = validateInteger(undefined)
      expect(validationResult).toBe(false)
    })
    test('when boolean', () => {
      const validationResult = validateInteger(false)
      expect(validationResult).toBe(false)
    })
  })
})

describe('validateNumber(data)', () => {
  describe('returns true', () => {
    test('when a float', () => {
      const validationResult = validateNumber(5.245)
      expect(validationResult).toBe(true)
    })
    test('when a integer', () => {
      const validationResult = validateNumber(5)
      expect(validationResult).toBe(true)
    })
  })
  describe('returns false', () => {
    test('when array', () => {
      const validationResult = validateNumber(['Grizzly Bears'])
      expect(validationResult).toBe(false)
    })
    test('when an object', () => {
      const validationResult = validateNumber({ 'Grizzly': 'Bears' })
      expect(validationResult).toBe(false)
    })
    test('when a string', () => {
      const validationResult = validateNumber('5')
      expect(validationResult).toBe(false)
    })
    test('when undefined', () => {
      const validationResult = validateNumber(undefined)
      expect(validationResult).toBe(false)
    })
    test('when boolean', () => {
      const validationResult = validateNumber(false)
      expect(validationResult).toBe(false)
    })
  })
})

describe('validateRarityClass(data)', () => {
  describe('returns true', () => {
    test('when \'common\'', () => {
      const validationResult = validateRarityClass('common')
      expect(validationResult).toBe(true)
    })
    test('when \'uncommon\'', () => {
      const validationResult = validateRarityClass('uncommon')
      expect(validationResult).toBe(true)
    })
    test('when \'rare\'', () => {
      const validationResult = validateRarityClass('rare')
      expect(validationResult).toBe(true)
    })
    test('when \'mythic\'', () => {
      const validationResult = validateRarityClass('mythic')
      expect(validationResult).toBe(true)
    })
  })
  describe('returns false', () => {
    test('when array', () => {
      const validationResult = validateRarityClass(['Grizzly Bears'])
      expect(validationResult).toBe(false)
    })
    test('when an object', () => {
      const validationResult = validateRarityClass({ 'Grizzly': 'Bears' })
      expect(validationResult).toBe(false)
    })
    test('when a string that is not a rarity class', () => {
      const validationResult = validateRarityClass('5')
      expect(validationResult).toBe(false)
    })
    test('when undefined', () => {
      const validationResult = validateRarityClass(undefined)
      expect(validationResult).toBe(false)
    })
    test('when boolean', () => {
      const validationResult = validateRarityClass(false)
      expect(validationResult).toBe(false)
    })
  })
})
describe('validateManaCost(data)', () => {
  describe('returns true', () => {
    test('when \'\'', () => {
      const validationResult = validateManaCost('')
      expect(validationResult).toBe(true)
    })
    test('when \'2\'', () => {
      const validationResult = validateManaCost('2')
      expect(validationResult).toBe(true)
    })
    test('when \'black\'', () => {
      const validationResult = validateManaCost('black')
      expect(validationResult).toBe(true)
    })
    test('when \'blue\'', () => {
      const validationResult = validateManaCost('blue')
      expect(validationResult).toBe(true)
    })
    test('when \'green\'', () => {
      const validationResult = validateManaCost('green')
      expect(validationResult).toBe(true)
    })
    test('when \'red\'', () => {
      const validationResult = validateManaCost('red')
      expect(validationResult).toBe(true)
    })
    test('when \'white\'', () => {
      const validationResult = validateManaCost('white')
      expect(validationResult).toBe(true)
    })
    test('when \'2 white\'', () => {
      const validationResult = validateManaCost('2 white')
      expect(validationResult).toBe(true)
    })
    test('when \'2 white blue\'', () => {
      const validationResult = validateManaCost('2 white blue')
      expect(validationResult).toBe(true)
    })
    test('when \'blue blue white\'', () => {
      const validationResult = validateManaCost('2 white blue')
      expect(validationResult).toBe(true)
    })
    test('when \'x green\'', () => {
      const validationResult = validateManaCost('x green')
      expect(validationResult).toBe(true)
    })
    test('when \'x\'', () => {
      const validationResult = validateManaCost('x')
      expect(validationResult).toBe(true)
    })
    test('when \'0\'', () => {
      const validationResult = validateManaCost('0')
      expect(validationResult).toBe(true)
    })
    test('when \'x x\'', () => {
      const validationResult = validateManaCost('x x')
      expect(validationResult).toBe(true)
    })
    test('when \'x x blue\'', () => {
      const validationResult = validateManaCost('x x blue')
      expect(validationResult).toBe(true)
    })
    test('when \'x 2 black\'', () => {
      const validationResult = validateManaCost('x 2 black')
      expect(validationResult).toBe(true)
    })
    test('when \'x 2\'', () => {
      const validationResult = validateManaCost('x 2')
      expect(validationResult).toBe(true)
    })
  })
  describe('returns false', () => {
    test('when array', () => {
      const validationResult = validateManaCost(['Grizzly Bears'])
      expect(validationResult).toBe(false)
    })
    test('when an object', () => {
      const validationResult = validateManaCost({ 'Grizzly': 'Bears' })
      expect(validationResult).toBe(false)
    })
    test('when a string', () => {
      const validationResult = validateManaCost('multicolor')
      expect(validationResult).toBe(false)
    })
    test('when a float', () => {
      const validationResult = validateManaCost(5.245)
      expect(validationResult).toBe(false)
    })
    test('when undefined', () => {
      const validationResult = validateManaCost(undefined)
      expect(validationResult).toBe(false)
    })
    test('when boolean', () => {
      const validationResult = validateManaCost(false)
      expect(validationResult).toBe(false)
    })
    test('when \'2.5\'', () => {
      const validationResult = validateManaCost('2.5')
      expect(validationResult).toBe(false)
    })
    test('when \'white 2\'', () => {
      const validationResult = validateManaCost('white 2')
      expect(validationResult).toBe(false)
    })
    test('when \'2 3 white\'', () => {
      const validationResult = validateManaCost('white 2 3')
      expect(validationResult).toBe(false)
    })
    test('when \'white blu\'', () => {
      const validationResult = validateManaCost('white blu')
      expect(validationResult).toBe(false)
    })
    test('when \'x blue x\'', () => {
      const validationResult = validateManaCost('x blue x')
      expect(validationResult).toBe(false)
    })
    test('when \'x blue 2 x\'', () => {
      const validationResult = validateManaCost('x blue 2 x')
      expect(validationResult).toBe(false)
    })
    test('when \'blue x white\'', () => {
      const validationResult = validateManaCost('blue x white')
      expect(validationResult).toBe(false)
    })
    test('when \'2 2 2\'', () => {
      const validationResult = validateManaCost('2 2 2')
      expect(validationResult).toBe(false)
    })
  })
})