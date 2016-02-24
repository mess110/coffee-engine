DEFAULT_OPTIONS =
  width: 10
  height: 10
  wSegments: 5
  hSegments: 5
  scale: 5
  textureUrl: 'heightmap.png'
  heightmapUrl: 'heightmap.png'

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

  $scope.options = DEFAULT_OPTIONS

  $scope.updateTerrain = ->
    terrainGeneratorScene.updateTerrain($scope.options)

  $scope.saveJson = ->
    Utils.saveFile($scope.options, 'terrain.save')

  $scope.toggleStats = ->
    config.toggleStats()


class TerrainGeneratorScene extends BaseScene
  constructor: ->
    super()

    @scene.fog = Helper.fog(far: 300, color: 'white')
    @scene.add Helper.grid(size: 2000, step: 20, color: 'gray')
    engine.setClearColor(@scene.fog.color, 1)

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    @controls = Helper.orbitControls(engine)

    options = DEFAULT_OPTIONS
    Terrain.heightmap(options.heightmapUrl, options.heightmapUrl, options.width, options.height, options.wSegments, options.hSegments, options.scale)

  updateTerrain: (options) ->
    @scene.remove(@terrain.mesh) if @terrain?
    Terrain.heightmap_blocking(options)

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

config = Config.get()
config.fillWindow()
config.preventDefaultMouseEvents = false
config.width = config.width * 6 / 10

engine = new Engine3D()
engine.camera.position.set 0, 15, 100

terrainGeneratorScene = new TerrainGeneratorScene()
engine.addScene(terrainGeneratorScene)
engine.render()