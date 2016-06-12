server = require('../../../../../src/server/server.coffee') # for dev
# server = require('../../bower_components/coffee-engine/src/server/server.coffee')
common = require('../common.coffee').common

class Game extends server.Game
  tick: =>
    for input in @inputs
      continue unless @players[input.ownerId]?
      common.move(@players[input.ownerId], input)
      @players[input.ownerId].lastAckInputId = input.inputId
    @inputs.clear()

    for key of @players
      @sockets[key].emit('serverTick', players: @players)

  join: (socket, data) ->
    data.id = socket.id
    @sockets[socket.id] = socket

    data.position = { x: 0 }
    @players[socket.id] = data

    for key of @players
      @sockets[key].emit('join', data)
      if key != socket.id
        socket.emit('join', @players[key])

  move: (socket, data) ->
    @inputs.push data

  disconnect: (socket, data) ->
    delete @players[socket.id]
    delete @sockets[socket.id]
    for key of @players
      @sockets[key].emit('disconnect', id: socket.id)

exports.Game = Game
