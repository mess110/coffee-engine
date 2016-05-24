app.controller 'GameMakerController', ['$scope', '$mdToast', '$location', '$routeParams', ($scope, $mdToast, $location, $routeParams) ->
  EngineHolder.get().engine.removeDom()

  $scope.ui.project.name = $routeParams.id
]

app.controller 'NewGameController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  EngineHolder.get().engine.removeDom()

  $scope.json =
    name: 'Mario'
    template: 'project'

  $scope.templates = [
    'project'
    'basic'
  ]

  $scope.newGame = ->
    return unless $scope.json.name?

    src = "example/3d/#{$scope.json.template}"
    dest = "workspace/games/"
    finalDest = "#{dest}/#{$scope.json.name}"

    try
      fs.accessSync finalDest, fs.F_OK
    catch e
      copyFolderRecursiveSync(src, dest)
      fs.renameSync("#{dest}/#{$scope.json.template}", finalDest)

    $scope.goTo("game-maker/#{$scope.json.name}")
]
