config = Config.get()
config.fillWindow()

nm = NetworkManager.get()
nm.connect()

engine = new Engine3D()

gameScene = new GameScene()
loadingScene = new LoadingScene([], ->
  gameScene.init()
  engine.sceneManager.setScene(gameScene)
)
engine.addScene(loadingScene)
engine.addScene(gameScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
