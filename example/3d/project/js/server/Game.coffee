# server = require('../../../../../src/server/server.coffee') # for dev
server = require('../../bower_components/coffee-engine/src/server/server.coffee')
common = require('../common.coffee').common

class Game extends server.Game
  tick: =>
    for input in @inputs
      continue unless @players[input.id]?
      common.move(@players[input.id], input)
      @players[input.id].lastAckInputId = input.inputId
    @inputs.clear()

    for key of @players
      @sockets[key].emit('gameTick', game: @players)

  join: (socket, data) ->
    @sockets[socket.id] = socket

    data.id = socket.id
    data.position = { x: 0 }
    @players[socket.id] = data

    for key of @players
      @sockets[key].emit('join', data)
      if key != socket.id
        socket.emit('join', @players[key])

  move: (socket, data) ->
    data.id = socket.id
    @inputs.push data

  disconnect: (socket, data) ->
    delete @players[socket.id]
    delete @sockets[socket.id]
    for key of @players
      @sockets[key].emit('disconnect', id: socket.id)

exports.Game = Game
