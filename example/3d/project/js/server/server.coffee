#!/usr/bin/env coffee

server = require('../../../../../src/server/server.coffee') # for dev
# server = require('../../bower_components/coffee-engine/src/server/server.coffee')
Game = require('./Game.coffee').Game

config =
  pod:
    id: server.Utils.guid()
    dirname: __dirname
    version: 1
    port: 1337
  gameServer:
    ticksPerSecond: 50
    ioMethods: ['join', 'move']

class GameServer extends server.GameServer
  game: new Game(config.gameServer)

  move: (socket, data) ->
    @game.move(socket, data)

  join: (socket, data) ->
    @game.join(socket, data)

  disconnect: (socket) ->
    @game.disconnect(socket)

gameServer = new GameServer(config.gameServer)
pod = new server.Pod(config.pod, gameServer)
pod.listen()
