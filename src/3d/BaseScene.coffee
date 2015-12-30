class BaseScene
  constructor: ->
    @scene = new THREE.Scene()
    @lastMousePosition = undefined
    @keyboard = new THREEx.KeyboardState()
    @loaded = false
    @uptime = 0

  fullTick: (tpf) ->
    @uptime += tpf
    @tick(tpf)

  tick: (tpf) ->
    throw 'scene.tick not implemented'

  doMouseEvent: (event, raycaster) ->
    throw 'scene.doMouseEvent not implemented'

  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'
