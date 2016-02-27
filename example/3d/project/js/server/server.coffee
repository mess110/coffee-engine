#!/usr/bin/env coffee

# server = require('../../../../../src/server/server.coffee') # for dev
server = require('../../bower_components/coffee-engine/src/server/server.coffee')

config =
  guid: server.Utils.guid()
  dirname: __dirname
  version: 1
  port: 7076

class GameServer
  IO_METHODS: []

  connect: (socket) ->
    console.log "#{socket.id} connect"
    console.log pod.keys()

  disconnect: (socket, data) ->
    console.log "#{socket.id} disconnect"
    pod.broadcast('disconnect', id: socket.id)

gameServer = new GameServer()
pod = new server.Pod(config, gameServer)
pod.listen()
