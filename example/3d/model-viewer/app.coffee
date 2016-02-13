glob = require('glob')

app = angular.module('app', ['ngStorage'])

app.directive 'customOnChange', ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      onChangeHandler = scope.$eval(attrs.customOnChange)
      element.bind 'change', onChangeHandler
      return

  }

app.controller 'MainController', ($scope, $localStorage) ->

  $scope.loadDir = (event) ->
    if event?
      s = event.target.files[0].path
      $localStorage.loadedPath = s
    else
      s = $localStorage.loadedPath

    $scope.loadedPath = s

    glob("#{s}/**/*.json", {}, (er, files) ->
      $scope.files = files
      $scope.$apply()
    )

  $scope.viewModel = (path) ->
    modelViewerScene.viewModel($scope.nameFromPath(path), path)

  $scope.animate = (animationIndex) ->
    for animation in modelViewerScene.mesh.animations
      animation.stop()
    modelViewerScene.mesh.animations[animationIndex].play()

  $scope.updateAnimations = (animations) ->
    $scope.animations = []
    $scope.animations.push animation.data.name for animation in animations
    $scope.$apply()

  $scope.nameFromPath = (path) ->
    path.split('/').last().split('.json').first()

  $scope.toggleStats = ->
    config.toggleStats()

  if $localStorage.loadedPath?
    $scope.loadDir()

class ModelViewerScene extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    @controls = Helper.orbitControls(engine)
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

config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 5, 10
engine.renderer.setClearColor( 0xFFFFFF )

modelViewerScene = new ModelViewerScene()
engine.addScene(modelViewerScene)
engine.render()
