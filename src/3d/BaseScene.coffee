class BaseScene
  constructor: ->
    @scene = new THREE.Scene()
    @lastMousePosition = undefined

  tick: (tpf) ->
    throw 'scene.tick not implemented'

  doMouseDown: (raycaster) ->
    throw 'scene.doMouseDown not implemented'

  doMouseMove: (raycaster) ->
    @lastMousePosition = raycaster

  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'
