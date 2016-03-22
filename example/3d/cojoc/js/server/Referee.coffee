class Referee
  constructor: (constants) ->
    @constants = constants

  tick: (game) ->
    for input in game.inputs
      @processInput(game, input)

  # should return animation duration
  processInput: (game, input) ->
    if game.phase == @constants.Phase.mulligan

      handSelected = game[@_getPlayerIndexById(game, input.ownerId)].handSelected
      cardsInHand = game.cards.where(status: @constants.CardStatus.held, ownerId: input.ownerId).size()

      if input.cojocType == @constants.CojocType.card and not handSelected
        card = game.cards.where(index: input.index).first()
        if card.status == @constants.CardStatus.held
          card.status = @constants.CardStatus.displayed
        else
          card.status = @constants.CardStatus.held

      if input.cojocType == @constants.CojocType.endTurn and not handSelected
        if cardsInHand == 3
          game[@_getPlayerIndexById(game, input.ownerId)].handSelected = true
          displayedCards = game.cards.where(status: @constants.CardStatus.displayed, ownerId: input.ownerId)
          for card in displayedCards
            card.status = @constants.CardStatus.discarded

      if game.player1.handSelected and game.player2.handSelected
        game.phase = @constants.Phase.battle
        game[@_getPlayerIndexById(game, game.turnPlayerId)].mana = 1
        game[@_getPlayerIndexById(game, game.turnPlayerId)].maxMana = 1

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
      randomDeck = @_random(@constants.decks.size())
      game.player2.deckId = @constants.decks[randomDeck].id

    throw new Error('player1 deck missing') unless game.player1.deckId?
    throw new Error('player2 deck missing') unless game.player2.deckId?

    rand = @_random(2) + 1
    game.turnPlayerId = game["player#{rand}"].id

    game.player1 = @_preparePlayer(game, game.player1)
    game.player2 = @_preparePlayer(game, game.player2)

    game.cards = game.cards.shuffle()
    cardIndex = 0
    for card in game.cards
      card.index = cardIndex
      cardIndex += 1

    game

  _preparePlayer: (game, player) ->
    player.mana = 0
    player.maxMana = 0
    player.health = 21
    player.cardBack = 'cardBack'
    player.handSelected = false

    deck = @constants.decks.where(id: player.deckId).first()
    throw new Error("deck with id #{deck.id} not found") unless deck?

    for card in deck.cards
      foundCard = @constants.cards.where(id: card).first()
      throw new Error("card with id #{card} not found") unless foundCard?
      foundCard = @_prepareCard(foundCard, player)
      game.cards.push foundCard

    hero = @constants.cards.where(heroId: deck.heroId).first()
    throw new Error("hero with id #{deck.heroId} not found") unless hero?
    hero = @_prepareCard(hero, player)
    hero.status = @constants.CardStatus.played
    game.cards.insert 0, hero

    displayedCards = game.cards.where(ownerId: player.id, type: [@constants.CardType.minion, @constants.CardType.spell])
    for i in [0..4]
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

  # From Helper.clone
  # Can not use Helper class because Refereee will be used on the server
  _clone: (obj) ->
    JSON.parse(JSON.stringify(obj))

  _random: (n) ->
    Math.floor(Math.random() * n)

  _getPlayerIndexById: (game, id) ->
    if game.player1.id == id
      'player1'
    else
      'player2'

exports.Referee = Referee
