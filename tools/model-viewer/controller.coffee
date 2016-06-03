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

  $scope.merge = (file) ->
    unless $scope.first?
      $scope.first = file
      $scope.toast("#{file.key} marked for merge")
      return

    if $scope.first.libPath == file.libPath
      $scope.toast('can not merge same file')
      return

    firstName = $scope.first.key.split('_').first()
    secondName = file.key.split('_').first()

    if firstName != secondName
      $scope.toast('can not merge objects with different keys')
      $scope.first = undefined
      return

    first = JSON.parse(fs.readFileSync($scope.first.libPath))
    second = JSON.parse(fs.readFileSync(file.libPath))

    animationName = $scope.first.key.split('_').last()
    first.animations[0].name = animationName

    animationName2 = file.key.split('_').last()
    second.animations[0].name = animationName2

    first.animations.push second.animations[0]

    a = $scope.first.libPath.split('/')
    a.pop()

    filePath = "#{a.join('/')}/#{firstName}.json"
    string = JSON.stringify(first, null, 2)
    fs.writeFileSync filePath, string
    $scope.toast("merged as #{firstName}")

    $scope.first = undefined
