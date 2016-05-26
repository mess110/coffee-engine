app.controller 'GameMakerController', ['$scope', '$mdToast', '$location', '$routeParams', ($scope, $mdToast, $location, $routeParams) ->
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

    newScene = fileSystem.newScene($scope.workspace, $scope.ui.newFilename)
    $scope.editScene(newScene.path)

  $scope.editScene = (scene) ->
    $scope.workspace.lastOpenedScene = scene
    $scope.goTo('cinematic-editor')
]

app.controller 'NewGameController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  EngineHolder.get().engine.removeDom()

  $scope.ui.project.name = 'coffee-engine'
  $scope.json =
    name: 'Mario'
    template: 'project'

  $scope.templates = [
    'project'
    'basic'
  ]

  $scope.newGame = ->
    success = fileSystem.newGame($scope.json)
    $scope.goTo("game-maker/#{$scope.json.name}") if success
]
