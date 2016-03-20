assert = require('assert')

# require('../../bower_components/coffee-engine/src/shared/SyntaxSugar')
require('../../../../../src/shared/SyntaxSugar')
Referee = require('../../js/server/Referee').Referee
constants = require('../../js/server/Const').constants

describe 'Referee', ->

  beforeEach ->
    @ref = new Referee(constants)

  describe 'startGame()', ->
    it 'makes sure there are 2 players', ->
      assert.throws(->
        @ref.startGame({})
      , Error)

    it 'sets the vsBot flag', ->
      game = @ref.startGame(player1: { deckId: 1 }, player2: { deckId: 1 })
      assert.equal(false, game.vsBot)

      game = @ref.startGame(player1: { deckId: 1, vsBot: true }, player2: {})
      assert.equal(true, game.vsBot)

    it 'sets the phase', ->
      game = @ref.startGame(player1: { deckId: 1, vsBot: true }, player2: {})
      assert.equal(0, game.phase)
