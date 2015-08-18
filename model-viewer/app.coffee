config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 5, 10
engine.renderer.setClearColor( 0xFFFFFF )

app = angular.module('app', [])


app.directive 'customOnChange', ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      onChangeHandler = scope.$eval(attrs.customOnChange)
      element.bind 'change', onChangeHandler
      return

  }

app.controller 'MainController', ($scope) ->

  $scope.loadDir = (event) ->
    s = event.target.files[0].path
    exec = require('child_process').exec
    cmd = "./list_models.rb #{s}"
    exec cmd, (error, stdout, stderr) =>
      # TODO: error handling
      json = JSON.parse(stdout)

      $scope.files = json.files
      $scope.$apply()
      return

  $scope.viewModel = (path) ->
    modelViwerScene.viewModel($scope.nameFromPath(path), path)

  $scope.animate = (animationIndex) ->
    for animation in modelViwerScene.mesh.animations
      animation.stop()
    modelViwerScene.mesh.animations[animationIndex].play()

  $scope.updateAnimations = (animations) ->
    $scope.animations = []
    $scope.animations.push animation.data.name for animation in animations
    $scope.$apply()

  $scope.nameFromPath = (path) ->
    path.split('/').last().split('.json').first()

THREEx = THREEx or {}

###*
# build a classic 3 points lighting
# @return {THREE.Object3D} container for the 3 lights
###

THREEx.ThreePointsLighting = ->
  container = new (THREE.Object3D)
  object3d = new (THREE.AmbientLight)('#111111')
  object3d.name = 'Ambient light'
  container.add object3d
  object3d = new (THREE.DirectionalLight)('white', 0.225)
  object3d.position.set 2.6, 1, 3
  object3d.name = 'Back light'
  container.add object3d
  object3d = new (THREE.DirectionalLight)('white', 0.375)
  object3d.position.set -2, -1, 0
  object3d.name = 'Key light'
  container.add object3d
  object3d = new (THREE.DirectionalLight)('white', 0.75)
  object3d.position.set 3, 3, 2
  object3d.name = 'Fill light'
  container.add object3d
  container

class ModelViwerScene extends BaseScene
  constructor: ->
    super()

    light = new THREEx.ThreePointsLighting()
    light.position.set 0, 0, 5
    @scene.add light

    light = new THREEx.ThreePointsLighting()
    light.position.set 0, 0, -5
    @scene.add light

    @controls = new (THREE.OrbitControls)(engine.camera)
    @controls.damping = 0.2


  viewModel: (name, url) ->
    @scene.remove(@mesh) if @mesh?
    JsonModelManager.get().load(name, url, (mesh) =>
      @scene.add mesh
      # mesh.animations[1].play()
      @mesh = mesh
      @loaded = true

      angular.element(document.body).scope().updateAnimations(mesh.animations)
    )

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

modelViwerScene = new ModelViwerScene()
engine.addScene(modelViwerScene)

engine.render()
