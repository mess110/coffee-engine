class GameScene extends BaseScene
  init: ->
    @cube = Helper.cube()
    @scene.add @cube

    @light = Helper.ambientLight()
    @scene.add @light

    @controls = Helper.orbitControls(engine)

  tick: (tpf) ->
    @cube.rotation.x += tpf
    @cube.rotation.y += tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
