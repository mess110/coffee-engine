class GameScene extends BaseScene
  players: {}
  playerMeshes: {}
  inputs: []

  init: ->
    engine.camera.position.set 0, 0, 35
    engine.camera.lookAt(Helper.zero.clone())

    board = new Panel(
      key: 'board', width: 96 / 4 * 3, height: 54 / 4 * 3
    ).mesh
    @scene.add board

    @ref = new Referee(constants)

    @_startInputProcessing()

  _startInputProcessing: () ->
    @shifter = setInterval =>
      if @inputs.any() and !@processing
        @processing = true
        input = @inputs.shift()
        console.log "processed #{input.inputId}"
        sleepTime = @ref.processInput(@game, input)
        setTimeout =>
          @processing = false
        , sleepTime
    , 0

  uninit: ->
    super()
    clearInterval(@shifter)

  serverTick: (data) ->
    @game = data unless @game?
    for input in data.inputs
      @inputs.push input

  join: (data) ->

  emit: (data)->
    return unless @game
    if @game.id == 'bot'
      data = nm.fake(data) # set the inputId and timestamp
      getScope().addInput(data)
    else
      console.log 'networking not implemented'

  disconnect: (data) ->

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
    @emit(type: 'foo', hello: 'world')
