config = Config.get()
config.fillWindow()
# config.toggleStats()

nm = NetworkManager.get()
nm.connect()

nm.on 'join', (data) ->
  gameScene.join(data)

nm.on 'disconnect', (data) ->
  gameScene.disconnect(data)

nm.on 'serverTick', (data) ->
  gameScene.serverTick(data)

engine = new Engine3D()

class GameScene extends BaseScene
  init: (options) ->

  tick: (tpf) ->

  doKeyboardEvent: (event) ->

  doMouseEvent: (event, raycaster) ->


Engine3D.scenify(engine, ->
  # gameScene = new GameScene()
  # engine.initScene(gameScene)
)

engine.render()
