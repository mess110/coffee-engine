app.controller 'BezierController', ($scope) ->

  $scope.ui.project.name = 'Bezier Helper'
  $scope.setScene(bezierScene)

  updateEntries = ->
    $scope.entries = $scope.json.curve.split(',')

  $scope.wireframe = false
  $scope.json =
    type: 'bezier'
    curve: '20,157.2,130.02,100.0,150.5,246.2,492,176.3'
    text: 'Calul Nazdravan Brrrr'
    strokeStyle: 'black'
    letterPadding: 7
    drawCurve: true
    x: 0, y: 0
  updateEntries()

  $scope.$watch 'wireframe', (newValue, oldValue) ->
    bezierScene.toggleWireframe()

  for w in ['curve', 'text', 'letterPadding', 'drawCurve']
    $scope.$watch "json.#{w}", (newValue, oldValue) ->
      updateEntries()
      bezierScene.updateCurve($scope.json)

  $scope.updateEntries = ->
    $scope.json.curve = $scope.entries.join(',')
