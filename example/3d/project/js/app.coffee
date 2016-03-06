config = Config.get()
config.fillWindow()
config.toggleStats()

nm = NetworkManager.get()
nm.connect()

nm.on 'join', (data) ->
  gameScene.join(data)

nm.on 'disconnect', (data) ->
  gameScene.disconnect(data)

nm.on 'serverTick', (data) ->
  gameScene.serverTick(data)

engine = new Engine3D()

gameScene = new GameScene()
loadingScene = new LoadingScene([
  # Asset urls
], ->
  gameScene.init()
  engine.sceneManager.setScene(gameScene)
)
engine.addScene(loadingScene)
engine.addScene(gameScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
