class LightTest extends TestScene
  init: ->
    super()

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
