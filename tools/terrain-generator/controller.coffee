app.controller 'TerrainGeneratorController', ($scope) ->
  defaultTexture = "../#{$scope.workspace.localLib}textures/grass.png"
  defaultHeightmap = "../#{$scope.workspace.localLib}textures/heightmap.png"

  defaultOptions =
    width: 10
    height: 10
    # wSegments: 5
    # hSegments: 5
    scale: 5
    texture:
      libPath: defaultTexture
    heightmap:
      libPath: defaultHeightmap

  eng = EngineHolder.get().engine
  if eng?
    eng.appendDom()
    eng.initScene(terrainGeneratorScene, defaultOptions)

  $scope.options = defaultOptions

  $scope.updateTerrain = ->
    terrainGeneratorScene.updateTerrain($scope.options)

  $scope.saveJson = ->
    toSave = angular.copy($scope.options)
    for s in ['texture', 'heightmap']
      fileName = toSave[s].libPath.split('/').last()
      toSave[s].destPath = "assets/#{fileName}"

      if toSave[s].libPath.startsWith('../')
        toSave[s].libPath = toSave[s].libPath.substring(3)
    Utils.saveFile(toSave, 'terrain.save')

  $scope.toggleStats = ->
    config.toggleStats()

  $scope.textureChosen = (asset, result) ->
    newPath = result.libPath
    if !newPath.startsWith('/')
      newPath = "../#{newPath}"
    $scope.options.texture.libPath = newPath
    $scope.updateTerrain()

  $scope.heightmapChosen = (asset, result) ->
    newPath = result.libPath
    if !newPath.startsWith('/')
      newPath = "../#{newPath}"
    $scope.options.heightmap.libPath = newPath
    $scope.updateTerrain()

  $scope.getKeyName = (url) ->
    Utils.getKeyName(url, Utils.IMG_URLS)
