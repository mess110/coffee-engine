config = Config.get()
config.fillWindow()

engine = new Engine3D()

class LoadingScene extends BaseScene
  constructor: ->
    super()

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

loadingScene = new LoadingScene()
engine.addScene(loadingScene)

engine.render()
