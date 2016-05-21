config = Config.get()
config.fillWindow()
config.toggleStats()

engine = new Engine3D()

loadingScene = new LoadingScene([
  "assets/cinematic1.save.json"

  "assets/grass.png"
  "assets/bunny.json"
], ->
  scene = CinematicScene.fromSaveObjectKey('cinematic1')
  engine.addScene(scene)
  engine.sceneManager.setScene(scene)
)
engine.addScene(loadingScene)

engine.render()
