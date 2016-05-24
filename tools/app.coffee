glob = require('glob')
fs = require('fs')

app = angular.module 'MyApp', [
  'ngMaterial'
  'ngRoute'
  'mdColorPicker'
]

Persist.PREFIX = 'ce.editor'

Persist.defaultJson('workspace',
  gamesDir: 'workspace/games/'
  localLib: 'workspace/lib/'
  modelRepository: 'workspace/lib/models/'
)

app.config ['$routeProvider', ($routeProvider) ->
  $routeProvider
    .when('/', templateUrl: 'menu/index.html', controller: 'MenuController')
    .when('/model-viewer', templateUrl: 'model-viewer/index.html', controller: 'ModelViewerController')
    .when('/bezier-helper', templateUrl: 'bezier-helper/index.html', controller: 'BezierController')
    .when('/terrain-generator', templateUrl: 'terrain-generator/index.html', controller: 'TerrainGeneratorController')
    .when('/particle-playground', templateUrl: 'particle-playground/index.html', controller: 'ParticlePlaygroundController')
    .when('/cinematic-editor', templateUrl: 'cinematic-editor/index.html', controller: 'CinematicEditorController')
    .when('/settings', templateUrl: 'settings/index.html', controller: 'SettingsController')
    .otherwise redirectTo: '/'
  return
]

app.directive 'fileSelect', ['$window', ($window) ->
  {
    restrict: 'A'
    require: 'ngModel'
    link: (scope, el, attr, ctrl) ->
      fileReader = new ($window.FileReader)

      fileReader.onload = ->
        ctrl.$setViewValue fileReader.result
        if 'fileLoaded' of attr
          scope.$eval attr['fileLoaded']
        return

      fileReader.onprogress = (event) ->
        if 'fileProgress' of attr
          scope.$eval attr['fileProgress'],
            '$total': event.total
            '$loaded': event.loaded
        return

      fileReader.onerror = ->
        if 'fileError' of attr
          scope.$eval attr['fileError'], '$error': fileReader.error
        return

      fileType = attr['fileSelect']
      el.bind 'change', (e) ->
        fileName = e.target.files[0]
        if fileType == '' or fileType == 'text'
          fileReader.readAsText fileName
        else if fileType == 'data'
          fileReader.readAsDataURL fileName
        return
      return
  }
]

app.directive 'customOnChange', ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      onChangeHandler = scope.$eval(attrs.customOnChange)
      element.bind 'change', onChangeHandler
      return

  }

app.controller 'MainController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  $scope.goTo = (path) ->
    EngineHolder.get().engine.removeDom()
    $location.path path

  $scope.goToMenuItem = (menuItem) ->
    if menuItem.newWindow
      window.open(menuItem.href)
    else
      $scope.goTo(menuItem.href)
      # window.location.href = menuItem.href
]

class BezierScene extends BaseScene

  init: ->
    @engine = EngineHolder.get().engine

    @light1 = Helper.ambientLight()
    @scene.add @light1

    @scene.fog = Helper.fog(far: 70, color: 'white')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    @engine.setClearColor(@scene.fog.color, 1)
    @engine.camera.position.set 0, 0, 11

    @art = new ArtGenerator(width: 512, height: 512)

    @plane = new BaseModel()
    @plane.mesh = Helper.plane(width: 10, height: 10, wSegments: 20, hSegments: 20)
    @scene.add @plane.mesh

    @controls = Helper.orbitControls(@engine)
    @controls.damping = 0.2

  uninit: ->
    @controls.enabled = false if @controls?
    @scene.remove @grid
    @scene.remove @light1
    @scene.remove(@plane.mesh) if @plane?

  toggleWireframe: () ->
    @plane.toggleWireframe()

  updateCurve: (json) ->
    @art.fromJson(items: [json])
    material = Helper.materialFromCanvas(@art.canvas)
    material.map.minFilter = THREE.LinearFilter
    @plane.mesh.material = material

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

class ModelViewerScene extends BaseScene

  init: ->
    @light1 = Helper.ambientLight()
    @scene.add @light1
    @light2 = Helper.ambientLight()
    @scene.add @light2
    @light3 = Helper.ambientLight()
    @scene.add @light3
    @light4 = Helper.ambientLight()
    @scene.add @light4

    @scene.fog = Helper.fog(far: 70, color: 'white')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    @engine = EngineHolder.get().engine

    engine.camera.position.set 0, 5, 10
    @engine.setClearColor(@scene.fog.color, 1)

    @controls = Helper.orbitControls(@engine)
    @controls.enabled = true
    @controls.damping = 0.2

  uninit: ->
    @controls.enabled = false if @controls?
    @scene.remove @grid
    @scene.remove @light1
    @scene.remove @light2
    @scene.remove @light3
    @scene.remove @light4
    @scene.remove(@mesh) if @mesh?

  viewModel: (name, url) ->
    @scene.remove(@mesh) if @mesh?
    JsonModelManager.get().items[name] = undefined
    JsonModelManager.get().load(name, url, (mesh) =>
      @scene.add mesh
      @mesh = mesh
      @loaded = true
      angular.element(document.getElementById('my-view')).scope().updateAnimations(mesh.animations)
    )

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

class TerrainGeneratorScene extends BaseScene
  init: ->
    @scene.fog = Helper.fog(far: 300, color: 'white')
    @scene.add Helper.grid(size: 2000, step: 20, color: 'gray')
    engine.setClearColor(@scene.fog.color, 1)

    @light1 = Helper.ambientLight()
    @scene.add @light1
    @light2 = Helper.ambientLight()
    @scene.add @light2
    @light3 = Helper.ambientLight()
    @scene.add @light3

    engine.camera.position.set 0, 15, 100
    @controls = Helper.orbitControls(engine)

    options = DEFAULT_OPTIONS
    # TODO: fix strange hack
    # needed because Terrain.heightmap can not be run twice without crashing because
    # of ImageUtils.loadTexture
    try
      Terrain.heightmap(options.heightmapUrl, options.heightmapUrl, options.width, options.height, options.wSegments, options.hSegments, options.scale)
    catch e
      @updateTerrain(options)

  uninit: ->
    @controls.enabled = false if @controls?
    @scene.remove(@terrain.mesh) if @terrain?
    @scene.remove(@light1)
    @scene.remove(@light2)
    @scene.remove(@light3)

  updateTerrain: (options) ->
    @scene.remove(@terrain.mesh) if @terrain?
    Terrain.heightmap_blocking(options)

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

class ParticlePlaygroundScene extends BaseScene
  init: ->
    @scene.fog = Helper.fog(far: 40, color: 'black')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)
    engine.camera.position.set 0, 5, 10

    @controls = Helper.orbitControls(engine)

    @particle = new BaseParticle('particle-playground/star.png')
    @scene.add @particle.mesh

    @loaded = true

  uninit: ->
    @loaded = false
    @scene.remove @grid
    @scene.remove @particle.mesh

  tick: (tpf) ->
    return unless @loaded

    @particle.tick(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

config = Config.get()
config.fillWindow()

EngineHolder.get().engine = new Engine3D()
engine = EngineHolder.get().engine
engine.camera.position.set 7.4, 11.8, 10.1

modelViewerScene = new ModelViewerScene()
engine.addScene(modelViewerScene)

bezierScene = new BezierScene()
engine.addScene(bezierScene)

terrainGeneratorScene = new TerrainGeneratorScene()
engine.addScene(terrainGeneratorScene)

particlePlaygroundScene = new ParticlePlaygroundScene()
engine.addScene(particlePlaygroundScene)

EngineHolder.get().engine.removeDom()
engine.render()
