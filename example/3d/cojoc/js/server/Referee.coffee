class Referee
  constructor: (constants) ->
    @constants = constants

  tick: (game) ->
    for input in game.inputs
      @processInput(game, input)

  # should return animation duration
  processInput: (game, input) ->
    game.lastAckInputId = input.inputId
    game.inputHistory.push input
    1000

  clearInputs: (game) ->
    game.inputs = []

  startGame: (game = {}) ->
    throw new Error('player1 missing') unless game.player1?
    throw new Error('player2 missing') unless game.player2?

    game.vsBot = game.player1.vsBot == true
    game.inputs = []
    game.inputHistory = []

    game.cards = []
    game.phase = @constants.Phase.mulligan
    if game.vsBot
      game.id = 'bot'
      randomDeck = Helper.random(@constants.decks.size())
      game.player2.deckId = @constants.decks[randomDeck].id

    throw new Error('player1 deck missing') unless game.player1.deckId?
    throw new Error('player2 deck missing') unless game.player2.deckId?

    rand = Helper.random(2) + 1
    game.turnPlayerId = game["player#{rand}"].id

    game.player1 = @_preparePlayer(game, game.player1)
    game.player2 = @_preparePlayer(game, game.player2)

    game

  _preparePlayer: (game, player) ->
    player.mana = 0
    player.maxMana = 0
    player.health = 21
    player.cardBack = 'cardBack'

    deck = @constants.decks.where(id: player.deckId).first()
    throw new Error("deck with id #{deck.id} not found") unless deck?

    for card in deck.cards
      foundCard = @constants.cards.where(id: card).first()
      throw new Error("card with id #{card} not found") unless foundCard?
      foundCard = @_prepareCard(foundCard, player)
      game.cards.push foundCard

    game.cards = game.cards.shuffle()

    hero = @constants.cards.where(heroId: deck.heroId).first()
    throw new Error("hero with id #{deck.heroId} not found") unless hero?
    hero = @_prepareCard(hero, player)
    hero.status = @constants.CardStatus.played
    game.cards.insert 0, hero

    displayedCards = game.cards.where(ownerId: player.id, type: [@constants.CardType.minion, @constants.CardType.spell])
    for i in [0..2]
      displayedCards[i].status = @constants.CardStatus.displayed

    player

  _prepareCard: (obj, player) ->
    clone = @_clone(obj)
    clone.back = player.cardBack

    clone.ownerId = player.id
    clone.status = @constants.CardStatus.deck
    clone.original =
      attack: clone.attack
      health: clone.health
      cost: clone.cost
    clone

  _clone: (obj) ->
    JSON.parse(JSON.stringify(obj))

exports.Referee = Referee
