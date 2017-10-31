class MenuScene extends BaseScene
  init: (options) ->
    Hodler.item('engine').setClearColor( 0xbfd1e5 )

    @started = false

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (e) ->
    return if e.type == 'keyup' || @started
    @started = true
    Hodler.item('engine').initScene(Hodler.item('gameScene'))
