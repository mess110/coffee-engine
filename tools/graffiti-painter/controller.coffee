app.controller 'GraffitiPainterController', ($scope) ->
  $scope.ui.project.name = 'Graffiti Painter'
  $scope.setScene(graffitiPainterScene)

  $scope.artItemTypes = [
    'image', 'text', 'bezier'
  ]

  $scope.hasText = (item) ->
    ['text', 'bezier'].includes(item.type)

  $scope.options =
    clearColor: '#ffffff'
    width: 512
    height: 512
    items: [
      { type: 'text', text: 'foo', x: 0, y: 50, fillStyle: '#000000', 'strokeStyle': undefined }
    ]

  $scope.deleteItem = (item) ->
    $scope.options.items.remove(item)

  $scope.imageChosen = (asset, result) ->
    TextureManager.get().load(result.key, "../#{result.libPath}", ->
      asset.item.key = result.key
      $scope.refresh()
    )

  $scope.addItem = ->
    $scope.options.items.push {}

  $scope.$watch 'options.clearColor', (newValue, oldValue) ->
    engine.renderer.setClearColor(newValue)

  $scope.toggleStats = ->
    config.toggleStats()

  $scope.refresh = ->
    graffitiPainterScene.refresh($scope.options)

  $scope.refresh()
