class NetworkManager

  instance = null

  class PrivateClass
    constructor: () ->
      @socket = undefined

    connect: (namespace) ->
      namespace = '/' unless namespace?
      # uses socket.io from npm so there is no need for a connection string
      @socket = io.connect(namespace)

      @socket.on "error", (err) ->
        console.error err

      @socket.on "message", (msg) ->
        console.log msg

    emit: (event, params) ->
      params.timestamp = new Date().getTime()
      @socket.emit(event, params)

  @get: () ->
    instance ?= new PrivateClass()
