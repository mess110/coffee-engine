class MenuScene extends BaseScene
  init: (options) ->
    Hodler.item('engine').setClearColor( 0xbfd1e5 )

  tick: (tpf) ->

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (e) ->
    Hodler.item('engine').initScene(Hodler.item('gameScene'))
