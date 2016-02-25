config = Config.get()
config.fillWindow()
config.toggleDebug()

engine = new Engine3D()
engine.camera.position.set 0, 30, -40
Helper.fancyShadows(engine.renderer)

nm = NetworkManager.get()
nm.connect('http://localhost:7076/')

vj = new VirtualController()
vj.joystick2.addEventListener 'touchStart', ->
  Utils.toggleFullScreen()

gameScene = new GameScene()
loadingScene = new LoadingScene(['terrain.save', 'grass.png', 'heightmap3.png', 'bunny.json', '/bower_components/ocean/assets/img/waternormals.jpg', 'sky.jpg'], ->
  gameScene.init()

  engine.sceneManager.setScene(gameScene)
)
engine.addScene(loadingScene)
engine.addScene(gameScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
