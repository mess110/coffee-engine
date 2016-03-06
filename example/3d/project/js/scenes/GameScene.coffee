class GameScene extends BaseScene
  game: {}
  playerMeshes: {}
  inputs: []

  init: ->
    @key = nm.getSessionId()
    @scene.add Helper.ambientLight()
    nm.emit(type: 'join', name: 'kiki')

  discardAcknowledgedInputs: (lastAckInputId) ->
    @inputs = (input for input in @inputs when input.inputId > lastAckInputId)

  gameTick: (data) ->
    @game = data.game
    player = @playerMeshes[@key]
    if player?
      player.mesh.position.x = data.game[@key].position.x
      @discardAcknowledgedInputs(data.game[@key].lastAckInputId)
      player.move(@inputs)

  join: (data) ->
    @game[data.id] = data
    player = new Player()
    player.id = data.id
    @scene.add player.mesh
    @scene.add player.ghost
    @playerMeshes[player.id] = player
    player.mesh.position.x = @game[player.id].position.x

  disconnect: (data) ->
    player = @playerMeshes[data.id]
    if player?
      @scene.remove player.mesh
      @scene.remove player.ghost
      delete @playerMeshes[player.id]

  tick: (tpf) ->
    hash =
      type: 'move'
      tpf: tpf
      direction:
        x: 0

    if @keyboard.pressed('a')
      hash.direction.x = -5
    if @keyboard.pressed('d')
      hash.direction.x = 5

    nm.emit(hash)
    @inputs.push hash

    for key of @playerMeshes
      player = @playerMeshes[key]
      player.ghost.position.x = @game[player.id].position.x

      if player.id == @key
        player.move(hash)
      else
        player.interpolate(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
