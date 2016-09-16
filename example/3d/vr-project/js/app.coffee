app = angular.module('app', [])
engine = null
config = Config.get()

app.controller 'MainController', ($scope, $location) ->
  $scope.page =
    menu:
      visible: true

  $scope.goTo = (url) ->
    $location.path(url)

  $scope.start = ->
    $scope.page.menu.visible = false

    config.stereoVR = true
    config.fillWindow()
    engine = new Engine3D()
    Engine3D.scenify(engine, openHUD)
    engine.render()

    return

  openHUD = ->
    scene = SceneManager.get().currentScene()

    scene.player = new HudPlayer().attachCamera(engine.camera)
    scene.scene.add scene.player.mesh

    controls = new VRControls(engine.camera)

    scene.afterCinematic = (tpf) ->
      controls.tick(tpf)

class Player extends BaseModel
  constructor: ->

class HudPlayer extends Player

  attachCamera: (camera) ->
    @pitch = new THREE.Object3D()
    @pitch.add camera

    @yaw = new THREE.Object3D()
    @yaw.add @pitch

    @mesh = @yaw

    @

  move: (data) ->
    @mesh.position.set data.position.x, data.position.y, data.position.z

    # @pitch.rotation.x = data.pitch
    @yaw.rotation.y = data.yaw
