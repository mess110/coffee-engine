# @nodoc
class NetworkManager

  instance = null

  # Uses socket.io for networking
  class Singleton.NetworkManager
    socket: undefined

    # Connect to a namespace
    connect: (namespace) ->
      namespace = '/' unless namespace?
      # uses socket.io from npm so there is no need for a connection string
      @socket = io.connect(namespace)

      @socket.on "error", (err) ->
        console.error err

      @socket.on "message", (msg) ->
        console.log msg

    # Emit an event
    #
    # @param [String] event name
    # @param [Object] event payload
    emit: (event, params) ->
      params.timestamp = new Date().getTime()
      @socket.emit(event, params)

  @get: () ->
    instance ?= new Singleton.NetworkManager()
