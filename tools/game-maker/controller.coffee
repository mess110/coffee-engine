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

    newScene = fileSystem.newScene($scope.workspace, $scope.ui.newFilename)
    $scope.editScene(newScene.path)

  $scope.editScene = (scene) ->
    $scope.workspace.lastOpenedScene = scene
    $scope.saveWorkspace()
    $scope.goTo('cinematic-editor')

  $scope.run = ->
    gamePath = "http://localhost:8080/workspace/games/#{$scope.workspace.lastOpenedProject}/"
    $window.open(gamePath)
]

app.controller 'NewGameController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  EngineHolder.get().engine.removeDom()

  $scope.ui.project.name = 'coffee-engine'
  $scope.json =
    name: 'Mario'
    template: 'cinema'

  $scope.templates = [
    { name: 'cinema', hint: 'Cinematic template for storytelling.' }
    { name: 'basic', hint: 'Minimal template.' }
    { name: 'project', hint: 'Project template with networking and build tools.'}
  ]

  $scope.newGame = ->
    success = fileSystem.newGame($scope.json)
    $scope.goTo("game-maker/#{$scope.json.name}") if success
]
