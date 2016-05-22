config = Config.get()
config.fillWindow()
config.toggleStats()

engine = new Engine3D()

loadingScene = new LoadingScene([
  "assets/cinematic1.save.json"
], ->
  loadingScene.hasFinishedLoading = ->
    scene = CinematicScene.fromSaveObjectKey('cinematic1')
    engine.addScene(scene)
    engine.sceneManager.setScene(scene)
  assets = CinematicScene.getAssets('cinematic1')
  loadingScene.loadAssets(assets)
)
engine.addScene(loadingScene)

engine.render()
