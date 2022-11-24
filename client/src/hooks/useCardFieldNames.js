import { useState } from 'react'

const useCardFieldNames = () => {
  const [fieldNames, setFieldNames] = useState({
    name: '',
    price: '',
    rarity: '',
    cardNumber: '',
    manaCost: '',
    rulesText: ''
  })

  const setFieldName = (name, value) => {
    const fieldNamesCopy = { ...fieldNames }
    fieldNamesCopy[name] = value

    setFieldNames(fieldNamesCopy)
  }

  const getFieldName = (name) => {
    return fieldNames[name]
  }

  const getFieldNamesAsArray = () => {
    let fieldNamesArray = []

    for (const [key, value] of Object.entries(fieldNames)) {
      fieldNamesArray.push(`${key}: ${value}`)
    }

    return fieldNamesArray
  }

  return {
    getFieldName,
    setFieldName,
    fieldNames,
    getFieldNamesAsArray
  }
}

export default useCardFieldNames