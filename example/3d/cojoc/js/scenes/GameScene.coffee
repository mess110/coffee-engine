class GameScene extends BaseScene
  players: {}
  playerMeshes: {}
  inputs: []

  init: ->
    engine.camera.position.set 0, 0, 35
    engine.camera.lookAt(Helper.zero.clone())

    board = new Panel(
      key: 'board', width: 96 / 4 * 3, height: 54 / 4 * 3
    )
    board.mesh.renderOrder = renderOrder.get()
    @scene.add board.mesh

    manaBar = new ManaBar(reverse: true)
    manaBar.mesh.position.set -6.5, 13, 0
    @scene.add manaBar.mesh
    manaBar.update(5, 10)

    manaBar = new ManaBar(reverse: false)
    manaBar.mesh.position.set 6.5, -13, 0
    @scene.add manaBar.mesh
    manaBar.update(2, 10)

    @endTurnButton = new FlipButton(
      keyFront: 'endTurnFront'
      keyBack: 'endTurnBack'
      width: 8.9
      height: 6.4
    )
    @endTurnButton.mesh.position.x = 21
    @scene.add @endTurnButton.mesh

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
    if !@game?
      @_initGame(data)
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

  _initGame: (data) ->
    @game = data

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->
    if event.type == 'mousemove'
      @endTurnButton.glow(@endTurnButton.isHovered(raycaster), 'green')
    if event.type == 'mouseup'
      @endTurnButton.toggle()

  doKeyboardEvent: (event) ->
    @emit(type: 'foo', hello: 'world')
