app.controller 'HeightmapGeneratorController', ($scope, $interval) ->

  defaultOptions =
    width: 480
    height: 480
    radius: 10
    blur: 6
    strength: 0.01
    gradient:
      0: 'black'
      1: 'white'

  $scope.updateSize = ->
    $scope.heatCanvas.width = $scope.options.width
    $scope.heatCanvas.height = $scope.options.height
    $scope.heatCanvas.style.width = $scope.options.width
    $scope.heatCanvas.style.height = $scope.options.height
    $scope.heat.resize()

  $scope.updateProp = ->
    $scope.heat.radius(+$scope.options.radius, +$scope.options.blur)

  $scope.clear = ->
    $scope.heat.clear()
    $scope.heat.draw()

  $scope.ui.project.name = 'Heightmap Generator'
  $scope.options = defaultOptions
  $scope.heatCanvas = document.getElementById('heatmap')
  EngineHolder.get().engine.removeDom()
  $scope.heat = simpleheat('heatmap').draw()
  $scope.heat.gradient($scope.options.gradient)

  $scope.updateSize()

  $scope.heatCanvas.onmousedown = (e) ->
    $scope.mouseDown = true

  $scope.heatCanvas.onmouseup = (e) ->
    $scope.mouseDown = false

  $scope.heatCanvas.onmousemove = (e) ->
    if $scope.mouseDown == true
      $scope.heat.add([e.offsetX, e.offsetY, $scope.options.strength])
      $scope.heat.draw()

  $scope.save = ->
    destCanvas = $scope.heatCanvas.cloneNode()
    destCtx = destCanvas.getContext('2d')
    destCtx.fillStyle = 'black'
    destCtx.fillRect(0, 0, destCanvas.width, destCanvas.height)
    destCtx.drawImage($scope.heatCanvas, 0, 0)

    data = destCanvas.toDataURL()
    data = data.split(',')[1]
    Utils._ensureBlobPresence()
    saveAs Utils.base64ToBlob(data), 'heightmap.png'
