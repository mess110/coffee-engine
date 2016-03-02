class GameScene extends BaseScene
  init: ->
    @cube = Helper.cube()
    @scene.add @cube

    @scene.add Helper.ambientLight()
    @controls = Helper.orbitControls(engine)

  tick: (tpf) ->
    @cube.rotation.x += tpf
    @cube.rotation.y += tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
