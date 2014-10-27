engine = new Engine3D()

class LoadingScene extends BaseScene
  constructor: ->
    super()

  tick: (tpf) ->
    #console.log @lastMousePosition if @lastMousePosition?

  doMouseDown: (raycaster) ->

  doKeyboardEvent: (event) ->

loadingScene = new LoadingScene()
engine.addScene(loadingScene)

engine.render()
