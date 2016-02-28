# @nodoc
class NetworkManager

  instance = null

  # Uses socket.io for networking
  #
  # @example
  #   nm = NetworkManager.get()
  #   nm.connect('http://localhost:9292/namespace')
  #   nm.emit('ready', name: 'kiki')
  #
  #   nm.on 'move', (data) ->
  #     console.log data
  class Singleton.NetworkManager
    socket: undefined

    # Connect to a namespace
    connect: (namespace = '/') ->
      # uses socket.io from npm so there is no need for a connection string
      @socket = io.connect(namespace)

    # set a listener
    #
    # @example
    #   nm.on 'move', (data) ->
    #     console.log data
    on: (event, func) ->
      @socket.on event, func

    # Emit a raw event
    #
    # @param [String] name
    # @param [Object] data
    rawEmit: (name, data={}) ->
      data.timestamp = new Date().getTime()
      @socket.emit(name, data)

    # Emit an event
    #
    # Used with coffee-engine-server
    #
    # @param [Object] data
    emit: (data) ->
      @rawEmit('data', data)

  @get: () ->
    instance ?= new Singleton.NetworkManager()
