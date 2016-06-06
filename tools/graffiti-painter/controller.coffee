app.controller 'GraffitiPainterController', ($scope) ->

  $scope.artItemTypes = [
    'image', 'text', 'bezier'
  ]

  $scope.hasText = (item) ->
    ['text', 'bezier'].includes(item.type)

  $scope.options =
    clearColor: '#ffffff'
    width: 512
    height: 512
    plane: {
      width: Utils.PLANE_DEFAULT_WIDTH * 2
      height: Utils.PLANE_DEFAULT_HEIGHT * 2
      wSegments: Utils.PLANE_DEFAULT_W_SEGMENTS
      hSegments: Utils.PLANE_DEFAULT_H_SEGMENTS
    }
    kind: 'graffiti' # used for identifying when importing
    items: [
      { type: 'text', text: 'Overlay text', x: 0, y: 50, fillStyle: '#000000', 'strokeStyle': undefined }
      { type: 'text', text: 'or images', x: 170, y: 80, fillStyle: '#000000', 'strokeStyle': undefined, font: '20px Helvetica' }
    ]

  $scope.ui.project.name = 'Graffiti Painter'
  $scope.setScene(graffitiPainterScene, $scope.options)

  $scope.deleteItem = (item) ->
    $scope.options.items.remove(item)

  $scope.imageChosen = (asset, result) ->
    TextureManager.get().load(result.key, "../#{result.libPath}", ->
      asset.item ?= {}
      asset.item.asset ?= {}
      asset.item.asset.key = result.key
      asset.item.asset.libPath = result.libPath
      $scope.refresh()
    )

  $scope.addItem = ->
    $scope.options.items.push {}

  $scope.$watch 'options.clearColor', (newValue, oldValue) ->
    engine.renderer.setClearColor(newValue)

  $scope.toggleStats = ->
    config.toggleStats()

  $scope.refresh = ()->
    graffitiPainterScene.refresh($scope.options)

  $scope.saveJson = ->
    toSave = angular.copy($scope.options)
    Utils.saveFile(toSave, 'graffiti.save.json')

  $scope.graffitiLoaded = (params, graffiti) ->
    json = JSON.parse(fs.readFileSync(graffiti.libPath, 'utf8'))
    for item in json.items
      if item.type == 'image'
        item.asset.key = Utils.getKeyName(item.asset.libPath, Utils.IMG_URLS)
        $scope.imageChosen({}, item.asset)

    $scope.options = json
    $scope.refresh()

  $scope.refresh()
