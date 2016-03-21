class SandboxScene extends BaseScene
  cards: []

  init: ->
    engine.camera.position.z = 20
    engine.camera.lookAt(Helper.zero)

    card = new Card(constants.cards[3])
    @cards.push card

    for card in @cards
      @scene.add card.mesh

    @controls = Helper.orbitControls(engine)

  uninit: ->
    super()
    @controls.enabled = false

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->
    for card in @cards
      card.glow(card.isHovered(raycaster), 'blue')

  doKeyboardEvent: (event) ->
