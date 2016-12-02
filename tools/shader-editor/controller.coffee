app.controller 'ShaderEditorController', ($scope) ->
  $scope.ui.project.name = 'Shader Editor'
  $scope.setScene(shaderEditorScene)

  $scope.shader = {}
  $scope.shader.vertex = [
    'varying vec2 vUv;'
    ''
    'void main() {'
    '  vUv = uv;'
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );'
    '}'
  ].join('\n')

  $scope.shader.fragment = [
    'uniform float time;'
    'varying vec2 vUv;'
    ''
    'void main() {'
    '  vec2 position = -1.0 + 2.0 * vUv;'
    ''
    '  float red = abs(sin(position.x * position.y + time / 5.0));'
    '  float green = abs(sin(position.x * position.y + time / 4.0));'
    '  float blue = abs(sin(position.x * position.y + time / 3.0 ));'
    '  gl_FragColor = vec4(red, green, blue, 1.0);'
    '}'
  ].join('\n')

  $scope.shader.uniforms = [
    '{'
    '  time: {'
    '    type: "f",'
    '    value: 0'
    '  },'
    '  resolution: {'
    '    type: "v2",'
    '    value: new THREE.Vector2()'
    '  }'
    '}'
  ].join('\n')

  $scope.update = ->
    shaderEditorScene.setShader($scope.shader)

  $scope.update()
