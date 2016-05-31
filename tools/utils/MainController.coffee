app.controller 'MainController', ['$document', '$scope', '$location', '$window', '$mdToast', '$mdDialog', ($document, $scope, $location, $window, $mdToast, $mdDialog) ->
  $scope.ui =
    project:
      name: ''
  $scope.tools = [
    { name: 'Model Viewer', href: 'model-viewer' }
    { name: 'Particle Playground', href: 'particle-playground' }
    { name: 'Terrain Generator', href: 'terrain-generator' }
    { name: 'Shader Editor', href: 'shader-editor' }
    { name: 'Bezier Helper', href: 'bezier-helper' }
  ]

  $scope.regex =
    name: /^[a-zA-Z0-9-]+$/

  $scope.refreshProjects = ->
    workspaceQuery.getProjects($scope.workspace, (err, projects) ->
      $scope.projects = projects
      $scope.$apply()
    )

  $scope.setScene = (scene, options = {}) ->
    eng = EngineHolder.get().engine
    if eng?
      eng.appendDom()
      eng.initScene(scene, options)

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

  $scope.saveWorkspace = ->
    Persist.setJson('workspace', $scope.workspace)

  $scope.goToGame = ->
    if $scope.workspace.lastOpenedProject?
      $scope.goTo("/game-maker/#{$scope.workspace.lastOpenedProject}")
    else
      $scope.goTo('/')

  $scope.exit = ->
    win = gui.Window.get()
    win.close()

  $scope.showDevTools = ->
    gui.Window.get().showDevTools()

  $scope.reload = ->
    gui.Window.get().reload()

  $scope.loadProject = (project) ->
    $scope.goTo("/game-maker/#{project}")
    $scope.refreshProjects()

  $scope.openAssetSearch = ($event, asset, callback) ->
    $mdDialog.show(
      controller: AssetSearchController
      controllerAs: 'ctrl'
      templateUrl: 'asset_search.tmpl.html'
      parent: angular.element(document.body)
      targetEvent: $event
      clickOutsideToClose: true
      locals:
        asset: asset
    ).then((result) ->
      callback(asset, result)
    )

  $document.bind 'keypress', (event) ->
    if event.ctrlKey && event.which == 18
      $scope.run()

  $scope.run = ->
    return unless $scope.workspace.lastOpenedProject?
    gamePath = "http://localhost:8080/workspace/games/#{$scope.workspace.lastOpenedProject}/"
    $window.open(gamePath)
    return

  $scope.refreshProjects()
]
