class GameScene extends BaseScene
  constructor: ->
    super()

    @cube = Helper.cube()
    @scene.add @cube

    @light = Helper.ambientLight()
    @scene.add @light

    @controls = Helper.orbitControls(engine)

    @loaded = true

  tick: (tpf) ->
    return unless @loaded

    @cube.rotation.z += 1 * tpf
    @cube.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
