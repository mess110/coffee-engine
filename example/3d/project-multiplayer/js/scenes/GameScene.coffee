class GameScene extends BaseScene
  players: {}
  playerMeshes: {}
  inputs: []

  init: ->
    @key = nm.getSessionId()
    @scene.add Helper.ambientLight()
    nm.emit(type: 'join', name: 'kiki')

  discardAcknowledgedInputs: (lastAckInputId) ->
    @inputs = (input for input in @inputs when input.inputId > lastAckInputId)

  serverTick: (data) ->
    @players = data.players
    player = @playerMeshes[@key]
    if player?
      player.setPosition(data.players[@key])
      @discardAcknowledgedInputs(data.players[@key].lastAckInputId)
      player.move(@inputs)

  join: (data) ->
    @players[data.id] = data
    player = new Player()
    player.id = data.id
    @scene.add player.mesh
    @scene.add player.ghost
    @playerMeshes[player.id] = player
    player.setPosition(@players[player.id])

  disconnect: (data) ->
    player = @playerMeshes[data.id]
    if player?
      @scene.remove player.mesh
      @scene.remove player.ghost
      delete @playerMeshes[player.id]

  tick: (tpf) ->
    input = common.moveInput(tpf)

    if @keyboard.pressed('a')
      input.direction.x = -5
    if @keyboard.pressed('d')
      input.direction.x = 5

    nm.emit(input)
    @inputs.push input

    for key of @playerMeshes
      player = @playerMeshes[key]
      player.setGhostPosition(@players[player.id])

      if player.id == @key
        player.move(input)
      else
        player.interpolate(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
