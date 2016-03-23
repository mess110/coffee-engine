constants =
  max_mana: 10

  CojocType:
    endTurn: 'endTurn'
    card: 'card'

  Phase:
    mulligan: 0
    battle: 1
    finished: 2

  CardStatus:
    deck: 0
    displayed: 1
    held: 2
    played: 3
    discarded: 4

  CardType:
    hero: 0
    minion: 1
    spell: 2

  Hero:
    baba: 0
    ileana: 1
    zalmoxis: 2

# Assumption: for each card type there is a template for it
constants.ArtTemplates =
  0: [
    {
      type: 'image'
      key: 'heart'
      x: 250
      y: 20
      angle: 90
    }
  ]
  1: [
    {
      type: 'image'
      key: 'template'
    }
    {
      type: 'image'
      key: 'woodSword'
      x: 2, y: 380
    }
    {
      type: 'image'
      key: 'heart'
      x: 270
      y: 390
    }
    {
      type: 'image'
      key: 'mana'
      x: 0
      y: 0
    }
  ]
  2: [
    {
      type: 'image'
      key: 'template'
    }
    {
      type: 'image'
      key: 'mana'
      x: 0
      y: 0
    }
  ]

constants.art =
  babaDochia:
    picture: [
      {
        type: 'image'
        key: 'babaDochia'
        x: -60, y: 60
        angle: 90
      }
    ]
    front: [
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,310,150'
        # curve: '120,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
        text: 'Baba Dochia'
        strokeStyle: 'black'
        letterPadding: 5
        x: 20, y: 280
      }
    ]
  ileanaCosanzeana:
    picture: [
      {
        type: 'image'
        key: 'ileanaCosanzeana'
        x: -60, y: 60
        angle: 90
      }
    ],
    front: [
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,310,150'
        # curve: '120,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
        text: 'Ileana Cosanzeana'
        strokeStyle: 'black'
        letterPadding: 5
        y: 280
      }
    ]
  zalmoxis:
    picture: [
      {
        type: 'image'
        key: 'zalmoxis'
        x: -60, y: 60
        angle: 90
      }
    ]
    front: [
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,310,150'
        # curve: '120,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
        text: 'Zalmoxis'
        strokeStyle: 'black'
        letterPadding: 9
        x: 20, y: 280
      }
    ]
  corb:
    picture: [
      {
        type: 'image'
        key: 'corb'
      }
    ]
    front: [
      {
        type: 'text'
        font: '24px Helvetica'
        fillStyle: 'black'
        text: 'Nem fache nik'
        x: 95, y: 330
      }
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,300,150'
        # curve: '120,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
        text: 'Corb'
        strokeStyle: 'black'
        letterPadding: 7
        x: 110, y: 120
      }
    ]
  fireball:
    picture: [
      {
        type: 'image'
        key: 'fireball'
      }
    ]
    front: [
      {
        type: 'text'
        font: '24px Helvetica'
        fillStyle: 'black'
        text: 'Dmg in fata'
        x: 95, y: 330
      }
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,300,150'
        text: 'Fireball'
        strokeStyle: 'black'
        letterPadding: 7
        x: 110, y: 120
      }
    ]
  heal:
    picture: [
      {
        type: 'image'
        key: 'heal'
      }
    ]
    front: [
      {
        type: 'text'
        font: '24px Helvetica'
        fillStyle: 'black'
        text: 'Heal mah'
        x: 95, y: 330
      }
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,300,150'
        text: 'Heal'
        strokeStyle: 'black'
        letterPadding: 7
        x: 110, y: 120
      }
    ]
  iele:
    picture: [
      {
        type: 'image'
        key: 'iele'
      }
    ]
    front: [
      {
        type: 'text'
        font: '24px Helvetica'
        fillStyle: 'black'
        text: 'Nem fache nik'
        x: 95, y: 330
      }
      {
        type: 'bezier'
        curve: '10,100,110,175,210,100,300,150'
        # curve: '120,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
        text: 'Iele'
        strokeStyle: 'black'
        letterPadding: 7
        x: 110, y: 120
      }
    ]
  calulNazdravan:
    picture: [
      {
        type: 'image'
        key: 'calulNazdravan'
      }
    ]
    front: [
      {
        type: 'text'
        font: '24px Helvetica'
        fillStyle: 'black'
        text: 'Nem fache nik'
        x: 95, y: 330
      }
      {
        type: 'bezier'
        # curve: '10,100,110,175,210,100,300,150'
        # curve: '120,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
        curve: '0,157.2,130.02,100.0,150.5,246.2,280.7,176.3'
        text: 'Calul Nazdravan'
        strokeStyle: 'black'
        letterPadding: 7
        x: 0, y: 120
      }
    ]

# TODO: make sure all keys exist
constants.cards = [
  {
    id: 0
    heroId: constants.Hero.baba
    type: constants.CardType.hero
    health: 21
    art: constants.art['babaDochia']
  }
  {
    id: 1
    heroId: constants.Hero.ileana
    type: constants.CardType.hero
    health: 21
    art: constants.art['ileanaCosanzeana']
  }
  {
    id: 2
    heroId: constants.Hero.zalmoxis
    type: constants.CardType.hero
    health: 21
    art: constants.art['zalmoxis']
  }
  {
    id: 3
    type: constants.CardType.minion
    health: 2
    attack: 4
    cost: 3
    art: constants.art['corb']
  }
  {
    id: 4
    type: constants.CardType.spell
    cost: 4
    art: constants.art['fireball']
  }
  {
    id: 5
    type: constants.CardType.spell
    cost: 2
    art: constants.art['heal']
  }
  {
    id: 6
    type: constants.CardType.minion
    cost: 1
    attack: 3
    health: 1
    art: constants.art['calulNazdravan']
  }
  {
    id: 7
    type: constants.CardType.minion
    cost: 6
    attack: 3
    health: 1
    art: constants.art['iele']
  }
]

constants.dummyDeck = [
  3, 4, 5, 6, 7, 3, 4, 5, 6, 7
]

constants.decks = [
  {
    id: 0
    heroId: constants.Hero.baba
    name: 'Baba Dochia'
    description: 'draw a card and take 2 damage'
    url: 'assets/babaDochia.png'
    cards: constants.dummyDeck
  }
  {
    id: 1
    heroId: constants.Hero.ileana
    name: 'Ileana Cosanzeana'
    description: 'restore 2 health'
    url: 'assets/ileanaCosanzeana.png'
    cards: constants.dummyDeck
  }
  {
    id: 2
    heroId: constants.Hero.zalmoxis
    name: 'Zalmoxis'
    description: 'deal 1 damage'
    url: 'assets/zalmoxis.png'
    cards: constants.dummyDeck
  }
]

exports.constants = constants
