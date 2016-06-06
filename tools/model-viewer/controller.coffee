app.controller 'ModelViewerController', ($scope) ->

  $scope.refreshModelList = ->
    workspaceQuery.getModels($scope.workspace, (err, files) ->
      $scope.files = files
      $scope.$apply()
    )

  $scope.refreshModelList()
  $scope.setScene(modelViewerScene)

  $scope.ui.project.name = 'Model Viewer'
  $scope.light = true
  $scope.lightDefault = true
  $scope.search = ''
  $scope.searchFilter = (item) ->
    item.key.contains($scope.search)

  $scope.viewModel = (model) ->
    if !model.libPath.startsWith('/') && !model.libPath.startsWith('../')
      model.libPath = "../#{model.libPath}"
    $scope.wireframe = false
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

  $scope.toMerge = []

  $scope.markForMerge = (item) ->
    if $scope.toMerge.includes(item)
      $scope.toMerge.remove(item)
    else
      $scope.toMerge.push(item)

  $scope.merge = () ->
    if $scope.toMerge.isEmpty()
      $scope.toast("right click to mark models for merge")
      return

    if $scope.toMerge.size() == 1
      $scope.toast("need at least 2 models")
      return

    for model in $scope.toMerge
      unless model.key.includes('_')
        $scope.toast("all models need to be in the format 'key_animation-name'")
        return

    baseModelName = $scope.toMerge.first().key.split('_').first()

    for model in $scope.toMerge
      unless model.key.startsWith(baseModelName)
        $scope.toast('can not merge different models')
        return

    output = undefined
    for model in $scope.toMerge
      animationName = model.key.split('_').last()
      if output?
        newAnimation = JSON.parse(fs.readFileSync(model.libPath)).animations.first()
        newAnimation.name = animationName
        output.animations.push newAnimation
      else
        output = JSON.parse(fs.readFileSync(model.libPath))
        output.animations[0].name = animationName

    outputPath = $scope.toMerge.first().libPath.split('/')
    outputPath.pop()

    filePath = "#{outputPath.join('/')}/#{baseModelName}.json"
    string = JSON.stringify(output, null, 2)
    fs.writeFileSync filePath, string
    $scope.toast("merged as #{baseModelName}")
    $scope.toMerge = []
    $scope.refreshModelList()

  $scope.skinChosen = (param, asset) ->
    TextureManager.get().items[asset.key] = undefined
    TextureManager.get().load(asset.key, "../#{asset.libPath}", (key) ->
      modelViewerScene.baseModel.setSkin(key)
    )

  $scope.toggleWireframe = ->
    modelViewerScene.toggleWireframe()

  $scope.toggleLight = ->
    $scope.light = !$scope.light
    modelViewerScene.setLight($scope.light)
