app.controller 'GameMakerController', ['$scope', '$mdToast', '$location', '$window', '$routeParams', ($scope, $mdToast, $location, $window, $routeParams) ->
  EngineHolder.get().engine.removeDom()

  $scope.workspace.lastOpenedProject = $routeParams.id
  $scope.saveWorkspace()

  $scope.scenes = []
  $scope.ui.project.name = $routeParams.id
  $scope.ui.newFilename = ''

  workspaceQuery.getScenes($scope.workspace, $scope.ui.project.name, (err, scenes) ->
    $scope.scenes = scenes
    $scope.$apply()
  )

  $scope.newScene = ->
    return unless $scope.ui.newFilename?
    return if $scope.ui.newFilename == ''

    newSceneObj = fileSystem.newScene($scope.workspace, $scope.ui.newFilename)
    scenePath = fileSystem.getScenePath($scope.workspace, newSceneObj.id)
    $scope.editScene(scenePath)

  $scope.editScene = (scenePath) ->
    $scope.workspace.lastOpenedScene = scenePath
    $scope.saveWorkspace()
    $scope.goTo('cinematic-editor')

  $scope.getSceneName = (scene) ->
    scene.split('/').last().split('.').first()
]

app.controller 'NewGameController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  EngineHolder.get().engine.removeDom()

  $scope.ui.project.name = 'coffee-engine'
  $scope.json =
    name: 'Mario'
    template: 'cinema'

  $scope.templates = [
    { name: 'basic', hint: 'Minimal template. Does not have build tools.' }
    { name: 'cinema', hint: 'Cinematic template for storytelling.' }
    { name: 'project', hint: 'Project template with build tools.' }
    { name: 'project-multiplayer', hint: 'Project template with networking and build tools.' }
    { name: 'project-multiplayer-menu', hint: 'More complete project template' }
    { name: 'vr-project', hint: 'VR project with multiplayer and build tools.' }
  ]

  $scope.newGame = ->
    success = fileSystem.newGame($scope.json)
    $scope.goTo("game-maker/#{$scope.json.name}") if success
]
