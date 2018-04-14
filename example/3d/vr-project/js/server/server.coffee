#!/usr/bin/env coffee

server = require('../../../../../src/server/server.coffee') # for dev
# server = require('../../node_modules/coffee-engine/src/server/server.coffee')

config =
  pod:
    id: server.Utils.guid()
    dirname: __dirname
    version: 1
    port: 1337
  gameServer:
    ticksPerSecond: 50
    ioMethods: ['position']

class GameServer extends server.GameServer
  position: (socket, data) ->
    pod.broadcast('position', data)

  # disconnect: (socket) ->

gameServer = new GameServer(config.gameServer)
pod = new server.Pod(config.pod, gameServer)
pod.listen()
