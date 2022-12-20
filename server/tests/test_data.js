const testCards = [
  {
    'name': 'Baneblade Scoundrel',
    'cardNumber': 85,
    'manaCost': '3 black',
    'price': 0.07,
    'rulesText': 'Whenever Baneblade Scoundrel becomes blocked, each creature blocking it gets -1/-1 until end of turn.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWhenever Baneclaw Marauder becomes blocked, each creature blocking it gets -1/-1 until end of turn.\nWhenever a creature blocking Baneclaw Marauder dies, that creature\'s controller loses 1 life.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'name': 'Suspicious Stowaway',
    'cardNumber': 80,
    'manaCost': '1 blue',
    'price': 0.48,
    'rulesText': 'Suspicious Stowaway can\'t be blocked.\nWhenever Suspicious Stowaway deals combat damage to a player, draw a card, then discard a card.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nSeafaring Werewolf can\'t be blocked.\nWhenever Seafaring Werewolf deals combat damage to a player, draw a card.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'rare'
  },
  {
    'name': 'Poppet Stitcher',
    'cardNumber': 71,
    'manaCost': '2 blue',
    'price': 6.02,
    'rulesText': 'Whenever you cast an instant or sorcery spell, create a 2/2 black Zombie creature token with decayed. (It can\'t block. When it attacks, sacrifice it at end of combat.)\nAt the beginning of your upkeep, if you control three or more creature tokens, you may transform Poppet Stitcher.\n\n//\n\nCreature tokens you control lose all abilities and have base power and toughness 3/3.\nAt the beginning of your upkeep, you may transform Poppet Factory.',
    'rarity': 'mythic'
  },
  {
    'name': 'Overwhelmed Archivist',
    'cardNumber': 68,
    'manaCost': '2 blue',
    'price': 0.09,
    'rulesText': 'When Overwhelmed Archivist enters the battlefield, draw a card, then discard a card.\nDisturb {3}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nWhenever Archive Haunt attacks, draw a card, then discard a card.\nIf Archive Haunt would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'uncommon'
  },
  {
    'name': 'Mysterious Tome',
    'cardNumber': 63,
    'manaCost': '2 blue',
    'price': 0.09,
    'rulesText': '{2}, {T}: Draw a card. Transform Mysterious Tome.\n\n//\n\n{1}, {T}: Tap target nonland permanent. Transform Chilling Chronicle.',
    'rarity': 'uncommon'
  },
  {
    'name': 'Malevolent Hermit',
    'cardNumber': 61,
    'manaCost': '1 blue',
    'price': 1.42,
    'rulesText': '{U}, Sacrifice Malevolent Hermit: Counter target noncreature spell unless its controller pays {3}.\nDisturb {2}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nNoncreature spells you control can\'t be countered.\nIf Benevolent Geist would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'rare'
  },
  {
    'name': 'Galedrifter',
    'cardNumber': 55,
    'manaCost': '3 blue',
    'price': 0.03,
    'rulesText': 'Flying\nDisturb {4}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nIf Waildrifter would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'common'
  },
  {
    'name': 'Delver of Secrets',
    'cardNumber': 47,
    'manaCost': 'blue',
    'price': 0.57,
    'rulesText': 'At the beginning of your upkeep, look at the top card of your library. You may reveal that card. If an instant or sorcery card is revealed this way, transform Delver of Secrets.\n\n//\n\nFlying',
    'rarity': 'uncommon'
  },
  {
    'name': 'Covetous Castaway',
    'cardNumber': 45,
    'manaCost': '1 blue',
    'price': 0.08,
    'rulesText': 'When Covetous Castaway dies, mill three cards. (Put the top three cards of your library into your graveyard.)\nDisturb {3}{U}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nWhen Ghostly Castigator enters the battlefield, you may shuffle up to three target cards from your graveyard into your library.\nIf Ghostly Castigator would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'uncommon'
  },
  {
    'name': 'Baithook Angler',
    'cardNumber': 42,
    'manaCost': '1 blue',
    'price': 0.04,
    'rulesText': 'Disturb {1}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nIf Hook-Haunt Drifter would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'common'
  }
]

const addExpectedIdsAndAddProperties = (data, startId, properties) => {
  const modifiedData = []

  for (let i = 0; i < data.length; i++) {
    modifiedData.push({
      id: i + startId,
      ...data[i],
      ...properties,
    })
  }

  return modifiedData
}

const testCardsWithId = [
  {
    'id': 1,
    'card_set_id': 1,
    'name': 'Mystic Skull',
    'card_number': 256,
    'mana_cost': '2',
    'price': 0.09,
    'rules_text': '{1}, {T}: Add one mana of any color.\n{5}, {T}: Transform Mystic Skull.\n\n//\n\nLands you control have \'{T}: Add one mana of any color.\'',
    'rarity': 'uncommon'
  },
  {
    'id': 2,
    'card_set_id': 1,
    'name': 'Tovolar, Dire Overlord',
    'card_number': 246,
    'mana_cost': '1 red green',
    'price': 2.75,
    'rules_text': 'Whenever a Wolf or Werewolf you control deals combat damage to a player, draw a card.\nAt the beginning of your upkeep, if you control three or more Wolves and/or Werewolves, it becomes night. Then transform any number of Human Werewolves you control.\nDaybound\n\n//\n\nWhenever a Wolf or Werewolf you control deals combat damage to a player, draw a card.\n{X}{R}{G}: Target Wolf or Werewolf you control gets +X/+0 and gains trample until end of turn.\nNightbound',
    'rarity': 'rare'
  },
  {
    'id': 3,
    'card_set_id': 1,
    'name': 'Ludevic, Necrogenius',
    'card_number': 233,
    'mana_cost': 'blue black',
    'price': 0.4,
    'rules_text': 'Whenever Ludevic, Necrogenius enters the battlefield or attacks, mill a card.\n{X}{U}{U}{B}{B}, Exile X creature cards from your graveyard: Transform Ludevic. X can\'t be 0. Activate only as a sorcery.\n\n//\n\nAs this creature transforms into Olag, Ludevic\'s Hubris, it becomes a copy of a creature card exiled with it, except its name is Olag, Ludevic\'s Hubris, it\'s 4/4, and it\'s a legendary blue and black Zombie in addition to its other colors and types. Put a number of +1/+1 counters on Olag equal to the number of creature cards exiled with it.',
    'rarity': 'rare'
  },
  {
    'id': 4,
    'card_set_id': 1,
    'name': 'Kessig Naturalist',
    'card_number': 231,
    'mana_cost': 'red green',
    'price': 0.14,
    'rules_text': 'Whenever Kessig Naturalist attacks, add {R} or {G}. Until end of turn, you don\'t lose this mana as steps and phases end.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nOther Wolves and Werewolves you control get +1/+1.\nWhenever Lord of the Ulvenwald attacks, add {R} or {G}. Until end of turn, you don\'t lose this mana as steps and phases end.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 5,
    'card_set_id': 1,
    'name': 'Devoted Grafkeeper',
    'card_number': 218,
    'mana_cost': 'white blue',
    'price': 0.09,
    'rules_text': 'When Devoted Grafkeeper enters the battlefield, mill two cards.\nWhenever you cast a spell from your graveyard, tap target creature you don\'t control.\nDisturb {1}{W}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nDeparted Soulkeeper can block only creatures with flying.\nIf Departed Soulkeeper would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'uncommon'
  },
  {
    'id': 6,
    'card_set_id': 1,
    'name': 'Dennick, Pious Apprentice',
    'card_number': 217,
    'mana_cost': 'white blue',
    'price': 0.35,
    'rules_text': 'Lifelink\nCards in graveyards can\'t be the targets of spells or abilities.\nDisturb {2}{W}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nWhenever one or more creature cards are put into graveyards from anywhere, investigate. This ability triggers only once each turn. (Create a colorless Clue artifact token with \'{2}, Sacrifice this artifact: Draw a card.\')\nIf Dennick, Pious Apparition would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'rare'
  },
  {
    'id': 7,
    'card_set_id': 1,
    'name': 'Arlinn, the Pack\'s Hope',
    'card_number': 211,
    'mana_cost': '2 red green',
    'price': 8.48,
    'rules_text': 'Daybound (If a player casts no spells during their own turn, it becomes night next turn.)\n+1: Until your next turn, you may cast creature spells as though they had flash, and each creature you control enters the battlefield with an additional +1/+1 counter on it.\n\u22123: Create two 2/2 green Wolf creature tokens.\n\n//\n\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)\n+2: Add {R}{G}.\n0: Until end of turn, Arlinn, the Moon\'s Fury becomes a 5/5 Werewolf creature with trample, indestructible, and haste.',
    'rarity': 'mythic'
  },
  {
    'id': 8,
    'card_set_id': 1,
    'name': 'Tovolar\'s Huntmaster',
    'card_number': 204,
    'mana_cost': '4 green green',
    'price': 0.97,
    'rules_text': 'When Tovolar\'s Huntmaster enters the battlefield, create two 2/2 green Wolf creature tokens.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWhenever Tovolar\'s Packleader enters the battlefield or attacks, create two 2/2 green Wolf creature tokens.\n{2}{G}{G}: Another target Wolf or Werewolf you control fights target creature you don\'t control.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'rare'
  },
  {
    'id': 9,
    'card_set_id': 1,
    'name': 'Tireless Hauler',
    'card_number': 203,
    'mana_cost': '4 green',
    'price': 0.05,
    'rules_text': 'Vigilance\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nVigilance\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'common'
  },
  {
    'id': 10,
    'card_set_id': 1,
    'name': 'Outland Liberator',
    'card_number': 190,
    'mana_cost': '1 green',
    'price': 0.16,
    'rules_text': '{1}, Sacrifice Outland Liberator: Destroy target artifact or enchantment.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\n{1}, Sacrifice Frenzied Trapbreaker: Destroy target artifact or enchantment.\nWhenever Frenzied Trapbreaker attacks, destroy target artifact or enchantment defending player controls.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 11,
    'card_set_id': 2,
    'name': 'Hound Tamer',
    'card_number': 187,
    'mana_cost': '2 green',
    'price': 0.12,
    'rules_text': 'Trample\n{3}{G}: Put a +1/+1 counter on target creature.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nTrample\nOther Wolves and Werewolves you control have trample.\n{3}{G}: Put a +1/+1 counter on target creature.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 12,
    'card_set_id': 2,
    'name': 'Deathbonnet Sprout',
    'card_number': 181,
    'mana_cost': 'green',
    'price': 0.14,
    'rules_text': 'At the beginning of your upkeep, mill a card. Then if there are three or more creature cards in your graveyard, transform Deathbonnet Sprout. (To mill a card, put the top card of your library into your graveyard.)\n\n//\n\nAt the beginning of your upkeep, you may exile a card from a graveyard. If a creature card was exiled this way, put a +1/+1 counter on Deathbonnet Hulk.',
    'rarity': 'uncommon'
  },
  {
    'id': 13,
    'card_set_id': 2,
    'name': 'Burly Breaker',
    'card_number': 174,
    'mana_cost': '3 green green',
    'price': 0.1,
    'rules_text': 'Ward {1} (Whenever this creature becomes the target of a spell or ability an opponent controls, counter it unless that player pays {1}.)\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWard {3} (Whenever this creature becomes the target of a spell or ability an opponent controls, counter it unless that player pays {3}.)\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 14,
    'card_set_id': 2,
    'name': 'Bird Admirer',
    'card_number': 169,
    'mana_cost': '2 green',
    'price': 0.06,
    'rules_text': 'Reach\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nReach\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'common'
  },
  {
    'id': 15,
    'card_set_id': 2,
    'name': 'Village Watch',
    'card_number': 165,
    'mana_cost': '4 red',
    'price': 0.11,
    'rules_text': 'Haste\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWolves and Werewolves you control have haste.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 16,
    'card_set_id': 2,
    'name': 'Tavern Ruffian',
    'card_number': 163,
    'mana_cost': '3 red',
    'price': 0.06,
    'rules_text': 'Daybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'common'
  },
  {
    'id': 17,
    'card_set_id': 2,
    'name': 'Spellrune Painter',
    'card_number': 160,
    'mana_cost': '2 red',
    'price': 0.09,
    'rules_text': 'Whenever you cast an instant or sorcery spell, Spellrune Painter gets +1/+1 until end of turn.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWhenever you cast an instant or sorcery spell, Spellrune Howler gets +2/+2 until end of turn.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 18,
    'card_set_id': 2,
    'name': 'Smoldering Egg',
    'card_number': 159,
    'mana_cost': '1 red',
    'price': 1.23,
    'rules_text': 'Defender\nWhenever you cast an instant or sorcery spell, put a number of ember counters on Smoldering Egg equal to the amount of mana spent to cast that spell. Then if Smoldering Egg has seven or more ember counters on it, remove them and transform Smoldering Egg.\n\n//\n\nFlying\nWhenever you cast an instant or sorcery spell, Ashmouth Dragon deals 2 damage to any target.',
    'rarity': 'rare'
  },
  {
    'id': 19,
    'card_set_id': 2,
    'name': 'Reckless Stormseeker',
    'card_number': 157,
    'mana_cost': '2 red',
    'price': 0.88,
    'rules_text': 'At the beginning of combat on your turn, target creature you control gets +1/+0 and gains haste until end of turn.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nAt the beginning of combat on your turn, target creature you control gets +2/+0 and gains trample and haste until end of turn.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'rare'
  },
  {
    'id': 20,
    'card_set_id': 2,
    'name': 'Harvesttide Infiltrator',
    'card_number': 143,
    'mana_cost': '2 red',
    'price': 0.07,
    'rules_text': 'Trample\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nTrample\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'common'
  },
  {
    'id': 21,
    'card_set_id': 3,
    'name': 'Flame Channeler',
    'card_number': 141,
    'mana_cost': '1 red',
    'price': 0.13,
    'rules_text': 'When a spell you control deals damage, transform Flame Channeler.\n\n//\n\nWhenever a spell you control deals damage, put a flame counter on Embodiment of Flame.\n{1}, Remove a flame counter from Embodiment of Flame: Exile the top card of your library. You may play that card this turn.',
    'rarity': 'uncommon'
  },
  {
    'id': 22,
    'card_set_id': 3,
    'name': 'Fangblade Brigand',
    'card_number': 139,
    'mana_cost': '3 red',
    'price': 0.1,
    'rules_text': '{1}{R}: Fangblade Brigand gets +1/+0 and gains first strike until end of turn.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\n{1}{R}: Fangblade Eviscerator gets +1/+0 and gains first strike until end of turn.\n{4}{R}: Creatures you control get +2/+0 until end of turn.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'uncommon'
  },
  {
    'id': 23,
    'card_set_id': 3,
    'name': 'Vengeful Strangler',
    'card_number': 126,
    'mana_cost': '1 black',
    'price': 0.1,
    'rules_text': 'Vengeful Strangler can\'t block.\nWhen Vengeful Strangler dies, return it to the battlefield transformed under your control attached to target creature or planeswalker an opponent controls.\n\n//\n\nEnchant creature or planeswalker an opponent controls\nAt the beginning of your upkeep, enchanted permanent\'s controller sacrifices a nonland permanent, then that player loses 1 life.',
    'rarity': 'uncommon'
  },
  {
    'id': 24,
    'card_set_id': 3,
    'name': 'Shady Traveler',
    'card_number': 120,
    'mana_cost': '2 black',
    'price': 0.04,
    'rules_text': 'Menace (This creature can\'t be blocked except by two or more creatures.)\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nMenace (This creature can\'t be blocked except by two or more creatures.)\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'common'
  },
  {
    'id': 25,
    'card_set_id': 3,
    'name': 'Jerren, Corrupted Bishop',
    'card_number': 109,
    'mana_cost': '2 black',
    'price': 3.55,
    'rules_text': 'Whenever Jerren, Corrupted Bishop enters the battlefield or another nontoken Human you control dies, you lose 1 life and create a 1/1 white Human creature token.\n{2}: Target Human you control gains lifelink until end of turn.\nAt the beginning of your end step, if you have exactly 13 life, you may pay {4}{B}{B}. If you do, transform Jerren.\n\n//\n\nFlying, trample, lifelink\nSacrifice another creature: Draw a card.',
    'rarity': 'mythic'
  },
  {
    'id': 26,
    'card_set_id': 3,
    'name': 'Heirloom Mirror',
    'card_number': 105,
    'mana_cost': '1 black',
    'price': 0.08,
    'rules_text': '{1}, {T}, Pay 1 life, Discard a card: Draw a card, mill a card, then put a ritual counter on Heirloom Mirror. Then if it has three or more ritual counters on it, remove them and transform it. Activate only as a sorcery.\n\n//\n\nFlying\n{2}{B}: Exile target creature card from a graveyard. Put a +1/+1 counter on Inherited Fiend.',
    'rarity': 'uncommon'
  },
  {
    'id': 27,
    'card_set_id': 3,
    'name': 'Graveyard Trespasser',
    'card_number': 104,
    'mana_cost': '2 black',
    'price': 0.58,
    'rules_text': 'Ward\u2014Discard a card.\nWhenever Graveyard Trespasser enters the battlefield or attacks, exile up to one target card from a graveyard. If a creature card was exiled this way, each opponent loses 1 life and you gain 1 life.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWard\u2014Discard a card.\nWhenever Graveyard Glutton enters the battlefield or attacks, exile up to two target cards from graveyards. For each creature card exiled this way, each opponent loses 1 life and you gain 1 life.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'rare'
  },
  {
    'id': 28,
    'card_set_id': 3,
    'name': 'Ecstatic Awakener',
    'card_number': 100,
    'mana_cost': 'black',
    'price': 0.06,
    'rules_text': '{2}{B}, Sacrifice another creature: Draw a card, then transform Ecstatic Awakener. Activate only once each turn.\n\n//',
    'rarity': 'common'
  },
  {
    'id': 29,
    'card_set_id': 3,
    'name': 'Curse of Leeches',
    'card_number': 94,
    'mana_cost': '2 black',
    'price': 0.18,
    'rules_text': 'Enchant player\nAs this permanent transforms into Curse of Leeches, attach it to a player.\nAt the beginning of enchanted player\'s upkeep, they lose 1 life and you gain 1 life.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nLifelink\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'rare'
  },
  {
    'id': 30,
    'card_set_id': 3,
    'name': 'Covert Cutpurse',
    'card_number': 92,
    'mana_cost': '2 black',
    'price': 0.08,
    'rules_text': 'When Covert Cutpurse enters the battlefield, destroy target creature you don\'t control that was dealt damage this turn.\nDisturb {4}{B} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying, deathtouch\nIf Covetous Geist would be put into a graveyard from anywhere, exile it instead.',
    'rarity': 'uncommon'
  }
]

const newCard = {
  'cardSetId': 1,
  'name': 'Bladestitched Skaab',
  'cardNumber': 212,
  'manaCost': 'blue black',
  'price': 0.13,
  'rulesText': 'Other Zombies you control get +1/+0.',
  'rarity': 'uncommon'
}

const testCardSetsWithId = [
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

const testCardSets = [
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

const testUsers = [
  {
    username: 'zerocool',
    password: 'loocorez'
  },
  { username: 'acidburn',
    password: 'nrubdica'
  },
  {
    username: 'cerealkiller',
    password: 'relliklaerec'
  }
]

const testUsersWithId = [
  {
    id: 1,
    username: 'zerocool',
    password: 'loocorez'
  },
  { id: 2,
    username: 'acidburn',
    password: 'nrubdica'
  },
  {
    id: 3,
    username: 'cerealkiller',
    password: 'relliklaerec'
  }
]

const testDecksWithId = [
  {
    id: 1,
    user_id: 1,
    name: 'Blue/Green ramp',
    notes: 'A very basic Blue/Green ramp deck'
  },
  {
    id: 2,
    user_id: 1,
    name: 'White weenie deck',
    notes: 'A very basic white weenie aggro deck'
  },
  {
    id: 3,
    user_id: 3,
    name: 'Blue/Red control',
    notes: 'A very irritating control deck'
  }
]

const testDecks = [
  {
    user_id: 1,
    name: 'Blue/red/green/white draft deck',
    notes: 'Ended up with a deck that has too many colors. Not a winner.'
  },
  {
    user_id: 2,
    name: 'White monoaggro',
    notes: 'An aggerssive single color deck. Was made for the tournament.'
  },
  {
    user_id: 3,
    name: 'Green/Red big creatures',
    notes: 'The idea is to destroy everything the opponent can throw at me. Then kill them with large creaturs.'
  }
]

const newDeck = {
  name: 'Green/black dinosaur deck',
  notes: 'Did this because dinosaurs are awesome',
  cards: [
    {
      'id': 3,
      'nInDeck': 1,
      'sideboard': true,
      'name': 'Ludevic, Necrogenius',
      'cardNumber': 233,
      'manaCost': 'blue black',
      'price': 0.4,
      'rulesText': 'Whenever Ludevic, Necrogenius enters the battlefield or attacks, mill a card.\n{X}{U}{U}{B}{B}, Exile X creature cards from your graveyard: Transform Ludevic. X can\'t be 0. Activate only as a sorcery.\n\n//\n\nAs this creature transforms into Olag, Ludevic\'s Hubris, it becomes a copy of a creature card exiled with it, except its name is Olag, Ludevic\'s Hubris, it\'s 4/4, and it\'s a legendary blue and black Zombie in addition to its other colors and types. Put a number of +1/+1 counters on Olag equal to the number of creature cards exiled with it.',
      'rarity': 'rare'
    },
    {
      'id': 4,
      'nInDeck': 2,
      'sideboard': false,
      'name': 'Kessig Naturalist',
      'cardNumber': 231,
      'manaCost': 'red green',
      'price': 0.14,
      'rulesText': 'Whenever Kessig Naturalist attacks, add {R} or {G}. Until end of turn, you don\'t lose this mana as steps and phases end.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nOther Wolves and Werewolves you control get +1/+1.\nWhenever Lord of the Ulvenwald attacks, add {R} or {G}. Until end of turn, you don\'t lose this mana as steps and phases end.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
      'rarity': 'uncommon'
    },
    {
      'id': 5,
      'nInDeck': 3,
      'sideboard': true,
      'name': 'Devoted Grafkeeper',
      'cardNumber': 218,
      'manaCost': 'white blue',
      'price': 0.09,
      'rulesText': 'When Devoted Grafkeeper enters the battlefield, mill two cards.\nWhenever you cast a spell from your graveyard, tap target creature you don\'t control.\nDisturb {1}{W}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nDeparted Soulkeeper can block only creatures with flying.\nIf Departed Soulkeeper would be put into a graveyard from anywhere, exile it instead.',
      'rarity': 'uncommon'
    },
    {
      'id': 6,
      'nInDeck': 4,
      'sideboard': true,
      'name': 'Dennick, Pious Apprentice',
      'cardNumber': 217,
      'manaCost': 'white blue',
      'price': 0.35,
      'rulesText': 'Lifelink\nCards in graveyards can\'t be the targets of spells or abilities.\nDisturb {2}{W}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nWhenever one or more creature cards are put into graveyards from anywhere, investigate. This ability triggers only once each turn. (Create a colorless Clue artifact token with \'{2}, Sacrifice this artifact: Draw a card.\')\nIf Dennick, Pious Apparition would be put into a graveyard from anywhere, exile it instead.',
      'rarity': 'rare'
    }
  ]
}

const newDeckCards = [
  {
    deck_id: 4,
    card_id: 3,
    n_in_deck: 1,
    sideboard: true
  },
  {
    deck_id: 4,
    card_id: 4,
    n_in_deck: 2,
    sideboard: false
  },
  {
    deck_id: 4,
    card_id: 5,
    n_in_deck: 3,
    sideboard: true
  },
  {
    deck_id: 4,
    card_id: 6,
    n_in_deck: 4,
    sideboard: true
  }
]

const testCardDeckCombinations = [
  {
    deck_id: 1,
    card_id: 1,
    n_in_deck: 2,
    sideboard: false
  },
  {
    deck_id: 1,
    card_id: 2,
    n_in_deck: 1,
    sideboard: false
  },
  {
    deck_id: 1,
    card_id: 4,
    n_in_deck: 4,
    sideboard: true
  },
  {
    deck_id: 1,
    card_id: 6,
    n_in_deck: 1,
    sideboard: false
  },
  {
    deck_id: 1,
    card_id: 8,
    n_in_deck: 3,
    sideboard: false
  },
  {
    deck_id: 1,
    card_id: 9,
    n_in_deck: 2,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 21,
    n_in_deck: 2,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 23,
    n_in_deck: 1,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 25,
    n_in_deck: 4,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 26,
    n_in_deck: 3,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 27,
    n_in_deck: 1,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 29,
    n_in_deck: 4,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 14,
    n_in_deck: 2,
    sideboard: false
  },
  {
    deck_id: 3,
    card_id: 15,
    n_in_deck: 1,
    sideboard: true
  }
]

const testUpdatedCards = [
  {
    'id': 29,
    'name': 'Curse of Leeches',
    'cardNumber': 94,
    'manaCost': '2 black',
    'price': 0.18,
    'rulesText': 'Enchant player\nAs this permanent transforms into Curse of Leeches, attach it to a player.\nAt the beginning of enchanted player\'s upkeep, they lose 1 life and you gain 1 life.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nLifelink\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'rare',
    'nInDeck': 2,
    'sideboard': false
  },
  {
    'id': 24,
    'name': 'Shady Traveler',
    'cardNumber': 120,
    'manaCost': '2 black',
    'price': 0.04,
    'rulesText': 'Menace (This creature can\'t be blocked except by two or more creatures.)\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nMenace (This creature can\'t be blocked except by two or more creatures.)\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
    'rarity': 'common',
    'nInDeck': 3,
    'sideboard': true
  },
]

const testCardUpdatesOnDeckWithIdOne = {
  added: [
    {
      'id': 3,
      'name': 'Ludevic, Necrogenius',
      'cardNumber': 233,
      'manaCost': 'blue black',
      'price': 0.4,
      'rulesText': 'Whenever Ludevic, Necrogenius enters the battlefield or attacks, mill a card.\n{X}{U}{U}{B}{B}, Exile X creature cards from your graveyard: Transform Ludevic. X can\'t be 0. Activate only as a sorcery.\n\n//\n\nAs this creature transforms into Olag, Ludevic\'s Hubris, it becomes a copy of a creature card exiled with it, except its name is Olag, Ludevic\'s Hubris, it\'s 4/4, and it\'s a legendary blue and black Zombie in addition to its other colors and types. Put a number of +1/+1 counters on Olag equal to the number of creature cards exiled with it.',
      'rarity': 'rare',
      'nInDeck': 4,
      'sideboard': true
    },
    {
      'id': 5,
      'name': 'Devoted Grafkeeper',
      'cardNumber': 218,
      'manaCost': 'white blue',
      'price': 0.09,
      'rulesText': 'When Devoted Grafkeeper enters the battlefield, mill two cards.\nWhenever you cast a spell from your graveyard, tap target creature you don\'t control.\nDisturb {1}{W}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nDeparted Soulkeeper can block only creatures with flying.\nIf Departed Soulkeeper would be put into a graveyard from anywhere, exile it instead.',
      'rarity': 'uncommon',
      'nInDeck': 1,
      'sideboard': false
    },
    {
      'id': 10,
      'name': 'Outland Liberator',
      'cardNumber': 190,
      'manaCost': '1 green',
      'price': 0.16,
      'rulesText': '{1}, Sacrifice Outland Liberator: Destroy target artifact or enchantment.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\n{1}, Sacrifice Frenzied Trapbreaker: Destroy target artifact or enchantment.\nWhenever Frenzied Trapbreaker attacks, destroy target artifact or enchantment defending player controls.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
      'rarity': 'uncommon',
      'nInDeck': 1,
      'sideboard': true
    },
  ],
  deleted: [
    {
      'id': 1,
      'name': 'Mystic Skull',
      'cardNumber': 256,
      'manaCost': '2',
      'price': 0.09,
      'rulesText': '{1}, {T}: Add one mana of any color.\n{5}, {T}: Transform Mystic Skull.\n\n//\n\nLands you control have \'{T}: Add one mana of any color.\'',
      'rarity': 'uncommon',
      'nInDeck': 2,
      'sideboard': false
    },
    {
      'id': 2,
      'name': 'Tovolar, Dire Overlord',
      'cardNumber': 246,
      'manaCost': '1 red green',
      'price': 2.75,
      'rulesText': 'Whenever a Wolf or Werewolf you control deals combat damage to a player, draw a card.\nAt the beginning of your upkeep, if you control three or more Wolves and/or Werewolves, it becomes night. Then transform any number of Human Werewolves you control.\nDaybound\n\n//\n\nWhenever a Wolf or Werewolf you control deals combat damage to a player, draw a card.\n{X}{R}{G}: Target Wolf or Werewolf you control gets +X/+0 and gains trample until end of turn.\nNightbound',
      'rarity': 'rare',
      'nInDeck': 1,
      'sideboard': false
    },
  ],
  updated: [
    {
      'id': 6,
      'name': 'Dennick, Pious Apprentice',
      'cardNumber': 217,
      'manaCost': 'white blue',
      'price': 0.35,
      'rulesText': 'Lifelink\nCards in graveyards can\'t be the targets of spells or abilities.\nDisturb {2}{W}{U} (You may cast this card from your graveyard transformed for its disturb cost.)\n\n//\n\nFlying\nWhenever one or more creature cards are put into graveyards from anywhere, investigate. This ability triggers only once each turn. (Create a colorless Clue artifact token with \'{2}, Sacrifice this artifact: Draw a card.\')\nIf Dennick, Pious Apparition would be put into a graveyard from anywhere, exile it instead.',
      'rarity': 'rare',
      'nInDeck': 4,
      'sideboard': false
    },
    {
      'id': 8,
      'name': 'Tovolar\'s Huntmaster',
      'cardNumber': 204,
      'manaCost': '4 green green',
      'price': 0.97,
      'rulesText': 'When Tovolar\'s Huntmaster enters the battlefield, create two 2/2 green Wolf creature tokens.\nDaybound (If a player casts no spells during their own turn, it becomes night next turn.)\n\n//\n\nWhenever Tovolar\'s Packleader enters the battlefield or attacks, create two 2/2 green Wolf creature tokens.\n{2}{G}{G}: Another target Wolf or Werewolf you control fights target creature you don\'t control.\nNightbound (If a player casts at least two spells during their own turn, it becomes day next turn.)',
      'rarity': 'rare',
      'nInDeck': 1,
      'sideboard': true
    },
  ]
}

const testDeckCardsTableRowsWithIdOne = {
  added: testCardUpdatesOnDeckWithIdOne.added.map(card => ({
    card_id: card.id,
    deck_id: 1,
    n_in_deck: card.nInDeck,
    sideboard: card.sideboard
  })),
  deleted: testCardUpdatesOnDeckWithIdOne.deleted.map(card => ({
    card_id: card.id,
    deck_id: 1,
    n_in_deck: card.nInDeck,
    sideboard: card.sideboard
  })),
  updated: testCardUpdatesOnDeckWithIdOne.updated.map(card => ({
    card_id: card.id,
    deck_id: 1,
    n_in_deck: card.nInDeck,
    sideboard: card.sideboard
  }))
}

const camelCaseTestDeckObjects = {
  withoutId: {
    name: 'Blue/red/green/white draft deck',
    notes: 'Ended up with a deck that has too many colors. Not a winner.'
  },
  withId: {
    id: 1,
    name: 'Blue/red/green/white draft deck',
    notes: 'Ended up with a deck that has too many colors. Not a winner.'
  }
}

module.exports = {
  addExpectedIdsAndAddProperties,
  camelCaseTestDeckObjects,
  testCardSets,
  testCardSetsWithId,
  invalidCardSet,
  testCards,
  testCardsWithId,
  testUsers,
  testUsersWithId,
  testDecks,
  testDecksWithId,
  testCardDeckCombinations,
  testUpdatedCards,
  newCard,
  newDeck,
  newDeckCards,
  testCardUpdatesOnDeckWithIdOne,
  testDeckCardsTableRowsWithIdOne
}