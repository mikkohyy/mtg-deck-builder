const transformSnakeCaseCardFieldsToCamelCase = (card) => {
  const dbCompatible = {
    'id': card.id,
    'cardSetId': card.card_set_id,
    'name': card.name,
    'cardNumber': card.card_number,
    'manaCost': card.mana_cost,
    'price': card.price,
    'rulesText': card.rules_text,
    'rarity': card.rarity
  }

  return dbCompatible
}

module.exports = { transformSnakeCaseCardFieldsToCamelCase }