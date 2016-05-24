glob = require('glob')
fs = require('fs')
gui = require('nw.gui')
path = require('path')

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

app.run [ ->
  Persist.PREFIX = 'ce.editor'

  Persist.defaultJson('workspace',
    gamesDir: 'workspace/games/'
    localLib: 'workspace/lib/'
    modelRepository: 'workspace/lib/models/'
  )
]

copyFileSync = (source, target) ->
  targetFile = target
  #if target is a directory a new file with the same name will be created
  if fs.existsSync(target)
    if fs.lstatSync(target).isDirectory()
      targetFile = path.join(target, path.basename(source))
  fs.writeFileSync targetFile, fs.readFileSync(source)
  return

copyFolderRecursiveSync = (source, target) ->
  files = []
  #check if folder needs to be created or integrated
  targetFolder = path.join(target, path.basename(source))
  if !fs.existsSync(targetFolder)
    fs.mkdirSync targetFolder
  #copy
  if fs.lstatSync(source).isDirectory()
    files = fs.readdirSync(source)
    files.forEach (file) ->
      curSource = path.join(source, file)
      if fs.lstatSync(curSource).isDirectory()
        copyFolderRecursiveSync curSource, targetFolder
      else
        copyFileSync curSource, targetFolder
      return
  return
