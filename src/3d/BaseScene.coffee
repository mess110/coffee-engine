class BaseScene
  constructor: ->
    @scene = new THREE.Scene()
    @lastMousePosition = undefined
    @loaded = false

  tick: (tpf) ->
    throw 'scene.tick not implemented'

  doMouseEvent: (event, raycaster) ->
    throw 'scene.doMouseEvent not implemented'

  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'
