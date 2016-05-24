app.controller 'BezierController', ($scope) ->
  eng = EngineHolder.get().engine
  if eng?
    eng.appendDom()
    eng.initScene(bezierScene)

  $scope.wireframe = false
  $scope.json =
    type: 'bezier'
    curve: '20,157.2,130.02,100.0,150.5,246.2,492,176.3'
    text: 'Calul Nazdravan Brrrr'
    strokeStyle: 'black'
    letterPadding: 7
    drawCurve: true
    x: 0, y: 0

  $scope.$watch 'wireframe', (newValue, oldValue) ->
    bezierScene.toggleWireframe()

  for w in ['curve', 'text', 'letterPadding', 'drawCurve']
    $scope.$watch "json.#{w}", (newValue, oldValue) ->
      bezierScene.updateCurve($scope.json)

# config = Config.get()
# config.fillWindow()
# config.preventDefaultMouseEvents = false

# engine = new Engine3D()
# engine.camera.position.set 0, 0, 11
# config.height = config.height - 204
