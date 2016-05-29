glob = require('glob')
fs = require('fs')
gui = require('nw.gui')
path = require('path')
fileSystem = new FileSystem()
workspaceQuery = new WorkspaceQuery()

app = angular.module 'MyApp', [
  'ngMaterial'
  'ngRoute'
  'mdColorPicker'
  'ui.codemirror'
]

app.config ['$routeProvider', ($routeProvider) ->
  $routeProvider
    .when('/game-maker/new', templateUrl: 'game-maker/new.html', controller: 'NewGameController')
    .when('/game-maker/:id', templateUrl: 'game-maker/show.html', controller: 'GameMakerController')
    .when('/model-viewer', templateUrl: 'model-viewer/index.html', controller: 'ModelViewerController')
    .when('/bezier-helper', templateUrl: 'bezier-helper/index.html', controller: 'BezierController')
    .when('/terrain-generator', templateUrl: 'terrain-generator/index.html', controller: 'TerrainGeneratorController')
    .when('/particle-playground', templateUrl: 'particle-playground/index.html', controller: 'ParticlePlaygroundController')
    .when('/cinematic-editor', templateUrl: 'cinematic-editor/index.html', controller: 'CinematicEditorController')
    .when('/shader-editor', templateUrl: 'shader-editor/index.html', controller: 'ShaderEditorController')
    .when('/settings', templateUrl: 'settings/index.html', controller: 'SettingsController')
    .otherwise redirectTo: '/game-maker/new'
  return
]

app.run ['$rootScope', ($rootScope) ->
  Persist.PREFIX = 'ce.editor'

  Persist.defaultJson('workspace',
    gamesDir: 'workspace/games/'
    localLib: 'workspace/lib/'
    modelRepository: 'workspace/lib/models/'
  )

  $rootScope.workspace = Persist.getJson('workspace') || {}
]

AssetSearchController = ($timeout, $q, $scope, $mdDialog, asset) ->
  self = this

  querySearch = (query) ->
    if query then self.items.filter(createFilterFor(query)) else self.items

  loadAll = ->
    workspace = Persist.getJson('workspace')
    throw new Error('missing asset type') unless asset.type?
    dyno = asset.type.capitalizeFirstLetter()
    workspaceQuery["get#{dyno}s"](workspace, (err, textures) ->
      self.items = textures
      $scope.$apply()
    )

  ###*
  # Create filter function for a query string
  ###

  createFilterFor = (query) ->
    lowercaseQuery = angular.lowercase(query)
    (state) ->
      state.libPath.contains(lowercaseQuery)

  loadAll()
  self.querySearch = querySearch

  # ******************************
  # Template methods
  # ******************************

  self.cancel = ($event) ->
    $mdDialog.cancel()
    return

  self.finish = ($event) ->
    $mdDialog.hide(self.selectedItem)
    return

  return
