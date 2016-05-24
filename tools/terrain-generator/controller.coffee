DEFAULT_OPTIONS =
  width: 10
  height: 10
  wSegments: 5
  hSegments: 5
  scale: 5
  textureUrl: 'terrain-generator/heightmap.png'
  heightmapUrl: 'terrain-generator/heightmap.png'

app.controller 'TerrainGeneratorController', ($scope) ->
  eng = EngineHolder.get().engine
  if eng?
    eng.appendDom()
    eng.initScene(terrainGeneratorScene)

  $scope.options = DEFAULT_OPTIONS

  $scope.updateTerrain = ->
    terrainGeneratorScene.updateTerrain($scope.options)

  $scope.saveJson = ->
    Utils.saveFile($scope.options, 'terrain.save')

  $scope.toggleStats = ->
    config.toggleStats()
