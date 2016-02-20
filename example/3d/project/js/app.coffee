config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 0, 10

gameScene = new GameScene()
loadingScene = new LoadingScene([], ->
  engine.sceneManager.setScene(gameScene)
)
engine.addScene(loadingScene)
engine.addScene(gameScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
