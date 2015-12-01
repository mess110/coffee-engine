config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 0, 100

class LoadingScene extends BaseScene
  constructor: ->
    super()

    @cube = Helper.cube()
    @scene.add @cube

    @light = Helper.ambientLight()
    @scene.add @light

    @loaded = true

  tick: (tpf) ->
    return unless @loaded

    @cube.rotation.z += 1 * tpf
    @cube.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->
    console.log 'asd'

  doKeyboardEvent: (event) ->

loadingScene = new LoadingScene()
engine.addScene(loadingScene)

engine.render()

app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
