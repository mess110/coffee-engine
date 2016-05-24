app.controller 'MainController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  $scope.ui =
    project:
      name: ''
  $scope.tools = [
    { name: 'Model Viewer', href: 'model-viewer' }
    { name: 'Particle Playground', href: 'particle-playground' }
    { name: 'Terrain Generator', href: 'terrain-generator' }
    { name: 'Bezier Helper', href: 'bezier-helper' }
  ]

  $scope.workspace = Persist.getJson('workspace')

  $scope.refreshProjects = ->
    path = "#{$scope.workspace.gamesDir}**/.coffee-engine"
    glob(path, {}, (er, projects) ->
      $scope.projects = []
      for project in projects
        $scope.projects.push project.split('/').slice(-2, -1)[0]
      $scope.$apply()
    )

  $scope.goTo = (path, newWindow = false) ->
    if newWindow
      window.open(path)
    else
      $location.path path
    return

  $scope.goToMenuItem = (menuItem) ->
    if menuItem.newWindow
      window.open(menuItem.href)
    else
      $scope.goTo(menuItem.href)
      # window.location.href = menuItem.href

  $scope.exit = ->
    win = gui.Window.get()
    win.close()

  $scope.loadProject = (project) ->
    $scope.goTo("/game-maker/#{project}")
    $scope.refreshProjects()

  $scope.refreshProjects()
]
