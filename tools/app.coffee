glob = require('glob')
fs = require('fs')
gui = require('nw.gui')
path = require('path')
fileSystem = new FileSystem()

app = angular.module 'MyApp', [
  'ngMaterial'
  'ngRoute'
  'mdColorPicker'
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
