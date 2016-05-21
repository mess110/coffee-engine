# @nodoc
class NetworkManager

  instance = null

  # Uses socket.io for networking
  #
  # TODO: inputId in base36 (maybe)
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
    inputId: 0

    # Connect to a namespace
    connect: (namespace = '/') ->
      # uses socket.io from npm so there is no need for a connection string
      @socket = io.connect(namespace)

    # Get the current session id, same one as on the server
    getSessionId: () ->
      return unless @socket?
      @socket.socket.sessionid

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
      data = @_prepareData(data)
      @socket.emit(name, data)

    # Fake emitting an event
    fakeEmit: (name, data={}) ->
      @_prepareData(data)

    # @nodoc
    _prepareData: (data={}) ->
      data.timestamp = new Date().getTime()
      data.inputId = @inputId
      @inputId += 1
      data

    # Emit an event
    #
    # Used with coffee-engine-server
    #
    # @param [Object] data
    emit: (data) ->
      throw 'data.type missing' unless data? or data.type?
      @rawEmit('data', data)

    # Fake an event
    fake: (data) ->
      throw 'data.type missing' unless data? or data.type?
      @fakeEmit('data', data)

  @get: () ->
    instance ?= new Singleton.NetworkManager()
