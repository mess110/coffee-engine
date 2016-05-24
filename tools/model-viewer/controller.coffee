app.controller 'ModelViewerController', ($scope) ->
  eng = EngineHolder.get().engine
  if eng?
    eng.appendDom()
    eng.initScene(modelViewerScene)

  $scope.workspace = Persist.getJson('workspace') || {}

  modelRepository = $scope.workspace.modelRepository
  if modelRepository.startsWith('/')
    $scope.loadedPath = modelRepository
  else
    $scope.loadedPath = "../../#{modelRepository}"
  $scope.loadedPath = modelRepository

  glob("#{$scope.loadedPath}/**/*.json", {}, (er, files) ->
    $scope.files = files
    $scope.$apply()
  )

  $scope.search = ''
  $scope.searchFilter = (item) ->
    item.contains($scope.search)

  $scope.viewModel = (path) ->
    if !path.startsWith('/')
      path = "../#{path}"
    modelViewerScene.viewModel($scope.nameFromPath(path), path)

  $scope.animate = (animationIndex) ->
    for animation in modelViewerScene.mesh.animations
      animation.stop()
    modelViewerScene.mesh.animations[animationIndex].play()

  $scope.updateAnimations = (animations) ->
    $scope.animations = []
    $scope.animations.push animation.data.name for animation in animations
    $scope.$digest()

  $scope.nameFromPath = (path) ->
    path.split('/').last().split('.json').first()

  $scope.toggleStats = ->
    config.toggleStats()
