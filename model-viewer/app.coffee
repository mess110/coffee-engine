config = Config.get()
config.modelsDirPath = '~/pr0n/blender'
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 5, 10
engine.renderer.setClearColor( 0xFFFFFF )

app = angular.module('app', [])
app.controller 'MainController', ($scope) ->
  exec = require('child_process').exec
  cmd = "./list_models.rb #{config.modelsDirPath}"
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

class ModelViwerScene extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.light()
    @scene.add Helper.ambientLight()

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
