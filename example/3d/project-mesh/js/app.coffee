config = Config.get()
config.fillWindow()
# config.toggleStats()

engine = Hodler.add('engine', new Engine3D())

class GameScene extends BaseScene
  init: (options) ->

  tick: (tpf) ->

  doKeyboardEvent: (event) ->

  doMouseEvent: (event, raycaster) ->

Engine3D.scenify(engine, ->
  # gameScene = new GameScene()
  # engine.initScene(gameScene)
)

engine.start()
