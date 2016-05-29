app.controller 'ModelViewerController', ($scope) ->

  workspaceQuery.getModels($scope.workspace, (err, files) ->
    $scope.files = files
    $scope.$apply()
  )

  $scope.setScene(modelViewerScene)

  $scope.ui.project.name = 'Model Viewer'
  $scope.search = ''
  $scope.searchFilter = (item) ->
    item.key.contains($scope.search)

  $scope.viewModel = (model) ->
    if !model.libPath.startsWith('/')
      model.libPath = "../#{model.libPath}"
    modelViewerScene.viewModel(model)

  $scope.animate = (animationIndex) ->
    for animation in modelViewerScene.mesh.animations
      animation.stop()
    modelViewerScene.mesh.animations[animationIndex].play()

  $scope.updateAnimations = (animations) ->
    $scope.animations = []
    $scope.animations.push animation.data.name for animation in animations
    $scope.$digest()

  $scope.toggleStats = ->
    config.toggleStats()
