class SandboxScene extends BaseScene
  cards: []

  init: ->
    engine.camera.position.z = 60
    engine.camera.lookAt(Helper.zero)

    @flipButton = new FlipButton(
      keyFront: 'endTurnFront'
      keyBack: 'endTurnBack'
      width: 8.9
      height: 6.4
    )
    @flipButton.mesh.position.x = 25
    @scene.add @flipButton.mesh

    @controls = Helper.orbitControls(engine)

  uninit: ->
    super()
    @controls.enabled = false

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
