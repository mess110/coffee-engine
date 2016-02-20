config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 0, 100

gameScene = new GameScene()
engine.addScene(gameScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
