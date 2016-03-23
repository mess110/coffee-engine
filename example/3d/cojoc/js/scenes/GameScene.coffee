class GameScene extends BaseScene
  players: {}
  playerMeshes: {}
  inputs: []

  init: ->
    engine.camera.position.set 0, 0, 35
    engine.camera.lookAt(Helper.zero.clone())

    @cards = []
    @isDown = false

    board = new Panel(
      key: 'board', width: 96 / 4 * 3, height: 54 / 4 * 3
    )
    board.mesh.renderOrder = renderOrder.get()
    @scene.add board.mesh

    @manaBar1 = new ManaBar(reverse: false)
    @manaBar1.mesh.position.set .5, -3, 0
    @manaBar1.update(1, 2)
    @scene.add @manaBar1.mesh

    @manaBar2 = new ManaBar(reverse: true)
    @manaBar2.mesh.position.set -.5, 3, 0
    @manaBar2.update(2, 3)
    @scene.add @manaBar2.mesh

    deck = new Card()
    deck.mesh.position.set 26, -7.7, 0
    deck.mesh.rotation.z = Math.PI / 2
    # @scene.add deck.mesh

    deck = new Card()
    deck.mesh.position.set 26, 7.7, 0
    deck.mesh.rotation.z = Math.PI / 2
    # @scene.add deck.mesh

    @darken = new Darken()
    @darken.mesh.position.z = 20
    @darken.mesh.renderOrder = renderOrder.get()
    @scene.add @darken.mesh

    @endTurnButton = new FlipButton(
      keyFront: 'endTurnFront'
      keyBack: 'endTurnBack'
      width: 8.9
      height: 6.4
    )
    @endTurnButton.mesh.position.x = 25
    @scene.add @endTurnButton.mesh

    @ref = new Referee(constants)

  getPlayerIndexById: (id) ->
    if @game.player1.id == id
      'player1'
    else
      'player2'

  processInput: (input) ->
    @processing = true

    oldPhase = @game.phase
    sleepTime = @ref.processInput(@game, input)

    @manaBar1.updatePlayer(@game[@ownIndex])
    @manaBar2.updatePlayer(@game[@enemyIndex])

    if @game.phase == constants.Phase.mulligan
      if input.cojocType == constants.CojocType.card
        @moveDisplayedCards(0)
        @moveHeldCards(0)

      if input.cojocType == constants.CojocType.endTurn
        @moveDiscardedCards(0)

      if input.ownerId == @ownId
        cardsInHand = @game.cards.where(status: constants.CardStatus.held, ownerId: input.ownerId).size()
        endPosition = cardsInHand == 3 and !@game[@getPlayerIndexById(input.ownerId)].handSelected
        @endTurnButton.set(endPosition)

    if @game.phase == constants.Phase.battle
      @darken.fade(0)
      @moveDiscardedCards(0)
      @instantiateHeldCards()
      @moveHeldCards(0)

      myTurn = @game.turnPlayerId == @ownId
      if oldPhase == constants.Phase.mulligan
        endTurnDur = @endTurnButton.set(false)
        setTimeout =>
          @endTurnButton.set(myTurn)
        , endTurnDur
      else
        @endTurnButton.set(myTurn)

    setTimeout =>
      @processing = false
    , sleepTime

  _startInputProcessing: () ->
    @shifter = setInterval =>
      if @inputs.any() and !@processing
        input = @inputs.shift()
        console.log "processed #{input.inputId}"
        @processInput(input) if input.ownerId != @ownId
    , 0

  uninit: ->
    super()
    @game = undefined
    clearInterval(@shifter)

  serverTick: (data) ->
    if !@game?
      @_initGame(data)
    for input in data.inputs
      @inputs.push input

  join: (data) ->

  emit: (data)->
    return unless @game
    if @game.id == 'bot'
      data.ownerId ?= @ownId
      data = nm.fake(data) # set the inputId and timestamp
      getScope().addInput(data)
      @processInput(data) if data.ownerId == @ownId
    else
      console.log 'networking not implemented'

  disconnect: (data) ->

  _initGame: (data) ->
    @game = data

    @ownIndex = if Persist.getJson('user').id == @game.player1.id then 'player1' else 'player2'
    @enemyIndex = if @ownIndex == 'player1' then 'player2' else 'player1'
    @ownId = @game[@ownIndex].id
    @enemyId = @game[@enemyIndex].id

    @manaBar1.updatePlayer(@game[@ownIndex])
    @manaBar2.updatePlayer(@game[@enemyIndex])

    if @game.phase == constants.Phase.mulligan
      @darken.fade(0.5)
      duration = 0

      # set end turn button position
      cardsInHand = @game.cards.where(status: constants.CardStatus.held, ownerId: @ownId).size()
      endPosition = cardsInHand == 3 and !@game[@ownIndex].handSelected
      @endTurnButton.set(endPosition)

      # move hero in position
      for hero in @game.cards.where(type: constants.CardType.hero)
        card = new Card().switchTo(hero)
        pos = PosHelp.draw(hero.ownerId)
        card.setPosition(pos)
        @scene.add card.mesh

        duration = new Animation().inHero(card, hero)

      @instantiateHeldCards()

      @moveHeldCards(duration - 1000)

      # instantiate displayed cards
      displayedCards = @game.cards.where(status: constants.CardStatus.displayed)
      for displayed in displayedCards
        card = new Card().switchTo(displayed)
        card.index = displayed.index
        pos = PosHelp.draw(displayed.ownerId)
        card.setPosition(pos)
        @scene.add card.mesh
        @cards.push card

      # move displayed cards
      @moveDisplayedCards(duration - 1000)

    @_startInputProcessing()

  tick: (tpf) ->
    for card in @cards
      if card.dissolveEffect?
          card.dissolveEffect.update(tpf)
          card.dissolveEffect2.update(tpf)

    return unless @game
    if @game.phase == constants.Phase.battle
      if @isDown and @hovered?
        @moveHeldCards(0, @hovered)
        @hovered.bringToFront()
        @hovered.clearMoveToTween()
        new Animation().inPreview(@hovered)

  getHoveredCard: (raycaster) ->
    hoveredCards = []
    for card in @cards
      hoveredCards.push card if card.isHovered(raycaster)
    hoveredCards.sort((a, b) ->
      a.front.mesh.renderOrder - b.front.mesh.renderOrder
    ).last()

  doMouseEvent: (event, raycaster) ->
    return unless @ownIndex
    @isDown = event.type == 'mousedown' or event.type == 'mousemove'

    if event.type == 'mousedown' and @endTurnButton.isHovered(raycaster)
      if @game.phase == constants.Phase.mulligan and @endTurnButton.canPress()
        @emit(cojocType: constants.CojocType.endTurn)

      if @game.phase == constants.Phase.battle and @endTurnButton.canPress()
        @emit(cojocType: constants.CojocType.endTurn)

    cardsInHand = @game.cards.where(status: constants.CardStatus.held, ownerId: @ownId)

    # Handle card clicking
    card = @getHoveredCard(raycaster)

    # if event.type == 'mousedown'
      # if @game.phase == constants.Phase.battle
        # card.bringToFront()
        # card.clearMoveToTween()
        # new Animation().inPreview(card)

    if event.type == 'mouseup' and @game.phase == constants.Phase.battle
      @moveHeldCards(0)
      @sortHand()

    if card?
      @hovered = card

      json = @game.cards.where(index: card.index, ownerId: @ownId).first()
      if event.type == 'mouseup'
        if @game.phase == constants.Phase.mulligan and !@game[@ownIndex].handSelected
          card.bringToFront()
          if (json.status == constants.CardStatus.displayed and cardsInHand.size() < 3) or json.status == constants.CardStatus.held
            @emit(cojocType: constants.CojocType.card, index: json.index)
    else
      @hovered = undefined


  doKeyboardEvent: (event) ->
    # @emit(type: 'foo', hello: 'world')

  sortHand: ->
    heldCards = @game.cards.where(status: constants.CardStatus.held)
    heldCards = heldCards.sort((a, b) -> a.handPosition - b.handPosition)
    for card in heldCards
      @cards.where(index: card.index).first().bringToFront()

  moveHeldCards: (duration, exception) ->
    heldCards = @game.cards.where(status: constants.CardStatus.held)
    for player in [@game.player1.id, @game.player2.id]
      i = 0
      playerHeldCards = heldCards.where(ownerId: player)
      playerHeldCards.sort((a, b) -> a.handPosition - b.handPosition)
      total = playerHeldCards.size()
      for held in playerHeldCards
        if exception?
          if held.index == exception.index
            i += 1
            continue
        card = @cards.where(index: held.index).first()
        new Animation().inHeld(card, held, duration, i, total)
        i += 1

  moveDisplayedCards: (duration) ->
    displayedCards = @game.cards.where(status: constants.CardStatus.displayed)
    for player in [@game.player1.id, @game.player2.id]
      i = 0
      playerDisplayedCards = displayedCards.where(ownerId: player)
      total = playerDisplayedCards.size()
      for displayed in playerDisplayedCards
        card = @cards.where(index: displayed.index).first()
        new Animation().inDisplayed(card, displayed, duration, i, total)
        i += 1

  moveDiscardedCards: (duration) ->
    discardedCards = @game.cards.where(status: constants.CardStatus.discarded)
    for player in [@game.player1.id, @game.player2.id]
      i = 0
      playerDiscardedCards = discardedCards.where(ownerId: player)
      total = playerDiscardedCards.size()
      for discarded in playerDiscardedCards
        card = @cards.where(index: discarded.index).first()
        new Animation().inDiscard(card, discarded, duration)
        card.dissolve()
        i += 1

  instantiateHeldCards: () ->
    heldCards = @game.cards.where(status: constants.CardStatus.held)
    for held in heldCards
      continue if @cards.where(index: held.index).any()
      card = new Card().switchTo(held)
      card.index = held.index
      pos = PosHelp.draw(held.ownerId)
      card.setPosition(pos)
      @scene.add card.mesh
      @cards.push card
