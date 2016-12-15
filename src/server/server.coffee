path = require('path')
express = require('express.io')

require('../shared/SyntaxSugar.coffee')
Utils = require('../shared/Utils.coffee').Utils
PodKeyManager = require('../server/PodKeyManager.coffee').PodKeyManager
GameInstance = require('../server/GameInstance.coffee').GameInstance

# Holds all the games and decides when to create new games.
#
# Certain actions should only be called in certain games, not to everyone connected
# to the pod
#
# @see Game
class GameServer
  games: []

  # Create a new GameServer
  constructor: (config) ->
    @config = config

  # Get a game by id
  #
  # @param [String] id
  getGame: (id) ->
    @games.where(id: id).first()

# It should represent a virtual/physical machine.
# It has only one GameServer instance.
#
# Once an event is triggered by socket.io, it calls the corresponding method
# on the GameServer
#
# @see GameServer
class Pod
  # create a new pod
  constructor: (config, gameServer) ->
    throw 'dirname missing' unless config.dirname?
    throw 'port missing' unless config.port?
    config.root_relative_to_dirname ?= '../../' # because it is (by default) under js/server/

    throw 'gameServer.config.ioMethods needs to be an array' unless Array.isArray(gameServer.config.ioMethods)
    console.log 'gameServer.config.ioMethods is empty' if gameServer.config.ioMethods.isEmpty()

    pkm = PodKeyManager.get()

    @config = config
    @gameServer = gameServer

    @app = express()
    @app.http().io()
    io = @app.io

    @app.use('/', express.static(path.join(@config.dirname, @config.root_relative_to_dirname)))

    @app.get '/config.json', (req, res) ->
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(config))

    io.on 'connection', (socket) ->
      pkm.push socket.id
      gameServer.connect(socket) if gameServer.connect?

      socket.on 'data', (data) ->
        data.ownerId = socket.id
        if gameServer.config.ioMethods.includes(data.type)
          gameServer[data.type](socket, data)
        else
          console.log "invalid data.type: '#{data.type}'"

      socket.on 'disconnect', ->
        pkm.remove socket.id
        gameServer.disconnect(socket) if gameServer.disconnect?

  # Return the keys from the PodKeyManager
  keys: ->
    PodKeyManager.get().keys

  # get a stocket by key
  socket: (key) ->
    @app.io.sockets.socket(key)

  # send an event with data to all the connected sockets
  #
  # @example
  #   pod.broadcast('event', { foo: 1 })
  broadcast: (eventName, data) ->
    for key in @keys()
      @socket(key).emit(eventName, data)

  # starts here
  listen: ->
    console.log "Listening on port #{@config.port}"
    @app.listen @config.port

exports.Pod = Pod
exports.PodKeyManager = PodKeyManager
exports.GameServer = GameServer
exports.GameInstance = GameInstance
exports.Utils = Utils
