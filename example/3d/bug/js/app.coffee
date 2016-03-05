config = Config.get()
config.fillWindow()

bear = undefined
bear2 = undefined
bm = undefined
bm2 = undefined

foo = ->
  bear = gameScene.bear
  bear2 = gameScene.bear2
  bm = bear.material.materials[0]
  bm2 = bear2.material.materials[0]

nm = NetworkManager.get()
# nm.connect()

engine = new Engine3D()

gameScene = new GameScene()
loadingScene = new LoadingScene([
  'assets/bear_all.json'
], ->
  gameScene.init()
  engine.sceneManager.setScene(gameScene)
)
engine.addScene(loadingScene)
engine.addScene(gameScene)

engine.render()
