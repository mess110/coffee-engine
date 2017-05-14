class HeightmapGeneratorScene extends BaseScene
  init: (options) ->
    engine.setWidthHeight(window.innerWidth - 320, window.innerHeight)
    engine.setClearColor('white', 1)

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
