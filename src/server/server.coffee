path = require('path')
express = require('express.io')

require('../shared/SyntaxSugar.coffee')
Utils = require('../shared/Utils.coffee').Utils
PodKeyManager = require('../server/PodKeyManager.coffee').PodKeyManager

# TODO: handle unlikely case of duplicate socket ids - if it can happen
class Pod
  # create a new pod
  constructor: (config, gameServer) ->
    throw 'dirname missing' unless config.dirname?
    throw 'port missing' unless config.port?
    config.root_relative_to_dirname ?= '../../' # because it is (by default) under js/server/

    throw 'gameServer.IO_METHODS needs to be an array' unless Array.isArray(gameServer.IO_METHODS)
    console.log 'gameServer.IO_METHODS is empty' if gameServer.IO_METHODS.isEmpty()

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

      for method in gameServer.IO_METHODS
        socket.on method, (data) ->
          gameServer[method](socket, data)

      socket.on 'disconnect', (data) ->
        pkm.remove socket.id
        gameServer.disconnect(socket, data) if gameServer.disconnect?

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
    for key in @keys
      @socket(key).emit(eventName, data)

  # starts here
  listen: ->
    console.log "Listening on port #{@config.port}"
    @app.listen @config.port

exports.Pod = Pod
exports.PodKeyManager = PodKeyManager
exports.Utils = Utils
