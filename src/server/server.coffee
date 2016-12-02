path = require('path')
express = require('express.io')

require('../shared/SyntaxSugar.coffee')
Utils = require('../shared/Utils.coffee').Utils
PodKeyManager = require('../server/PodKeyManager.coffee').PodKeyManager

# There can be many games running on a GameServer
#
# Each one has its own tick interval and is independent
# from other games
class Game

  # Creates a new game and start ticking
  constructor: (config) ->
    @players = {}
    @sockets = {}
    @inputs = []

    @id = Utils.guid()
    @config = config
    @setTickInterval(@config.ticksPerSecond)

  # This methods needs to be implemented by a class which extends the Game
  # It says what happens in a game tick.
  tick: =>
    throw 'tick needs to be implemented'

  # Change tick interval of the Game
  #
  # @param [Number] tps
  setTickInterval: (tps) ->
    @config.ticksPerSecond = tps
    clearInterval(@tickInterval) if @tickInterval?
    @tickInterval = setInterval @tick, 1000 / @config.ticksPerSecond

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
    for game in @games
      if game.id == id
        return game

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
exports.Game = Game
exports.Utils = Utils
