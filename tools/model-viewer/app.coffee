glob = require('glob')

Persist.PREFIX = 'ce.editor'

app = angular.module 'MyApp', [
  'ngMaterial'
]

app.controller 'MainController', ($scope) ->
  $scope.workspace = Persist.getJson('workspace') || {}
  modelRepository = $scope.workspace.modelRepository
  if modelRepository.startsWith('/')
    $scope.loadedPath = modelRepository
  else
    $scope.loadedPath = "../../#{modelRepository}"
  $scope.loadedPath = modelRepository

  glob("#{$scope.loadedPath}/**/*.json", {}, (er, files) ->
    $scope.files = files
    $scope.$apply()
  )

  $scope.search = ''
  $scope.searchFilter = (item) ->
    item.contains($scope.search)

  $scope.viewModel = (path) ->
    if !path.startsWith('/')
      path = "../../#{path}"
    modelViewerScene.viewModel($scope.nameFromPath(path), path)

  $scope.animate = (animationIndex) ->
    for animation in modelViewerScene.mesh.animations
      animation.stop()
    modelViewerScene.mesh.animations[animationIndex].play()

  $scope.updateAnimations = (animations) ->
    $scope.animations = []
    $scope.animations.push animation.data.name for animation in animations
    $scope.$digest()

  $scope.nameFromPath = (path) ->
    path.split('/').last().split('.json').first()

  $scope.toggleStats = ->
    config.toggleStats()

class ModelViewerScene extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    @scene.fog = Helper.fog(far: 70, color: 'white')
    @scene.add Helper.grid(size: 200, step: 10, color: 'gray')
    engine.setClearColor(@scene.fog.color, 1)

    @controls = Helper.orbitControls(engine)
    @controls.damping = 0.2

  viewModel: (name, url) ->
    @scene.remove(@mesh) if @mesh?
    JsonModelManager.get().items[name] = undefined
    JsonModelManager.get().load(name, url, (mesh) =>
      @scene.add mesh
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
engine.camera.position.set 7.4, 11.8, 10.1

modelViewerScene = new ModelViewerScene()
engine.addScene(modelViewerScene)
engine.render()
