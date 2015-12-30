DEFAULT_OPTIONS =
  width: 20
  height: 20
  wSegments: 5
  hSegments: 5
  scale: 1
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

  $scope.toggleStats = ->
    config.toggleStats()


class TerrainGeneratorScene extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    @controls = new (THREE.OrbitControls)(engine.camera, engine.renderer.domElement)
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
config.preventDefaultMouseEvents = false
config.fillWindow()
config.width = config.width / 2
config.resize = false

engine = new Engine3D()
engine.camera.position.set 0, 15, 100
engine.renderer.setClearColor( 0xF0F0F0 )

terrainGeneratorScene = new TerrainGeneratorScene()
engine.addScene(terrainGeneratorScene)
engine.render()
