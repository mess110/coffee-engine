class AI
  @getInput: (constants, game) ->
    return unless game.vsBot
    if game.phase == constants.Phase.mulligan
      if game.player2.handSelected
        return
      cardsInHand = game.cards.where(status: constants.CardStatus.held, ownerId: 'bot').size()
      if cardsInHand == 3
        return cojocType: constants.CojocType.endTurn, ownerId: 'bot'
      else
        displayedCards = game.cards.where(status: constants.CardStatus.displayed, ownerId: 'bot')
        return cojocType: constants.CojocType.card, index: displayedCards[0].index, ownerId: 'bot'

