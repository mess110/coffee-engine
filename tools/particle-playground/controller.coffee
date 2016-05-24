app.controller 'ParticlePlaygroundController', ($scope) ->
  eng = EngineHolder.get().engine
  if eng?
    eng.appendDom()
    eng.initScene(particlePlaygroundScene)
    $scope.particle = particlePlaygroundScene.particle

  $scope.options =
    clearColor: '#000000'
    emitter:
      colorStart: '#ff0000'
      colorMiddle: '#ffffff'
      colorEnd: '#0000ff'

  $scope.$watch 'options.clearColor', (newValue, oldValue) ->
    engine.renderer.setClearColor(newValue)

  for s in ['colorStart', 'colorMiddle', 'colorEnd']
    $scope.$watch "options.emitter.#{s}", (newValue, oldValue) ->
      color = new (THREE.Color)(newValue)
      $scope.particle.emitter[s] = color

  $scope.toggleStats = ->
    config.toggleStats()

  $scope.saveJson = ->
    hash = {
      group:
        textureUrl: $scope.particle.particleGroup.texture.sourceFile
        maxAge: $scope.particle.particleGroup.maxAge
        colorize: $scope.particle.particleGroup.colorize
        hasPerspective: $scope.particle.particleGroup.hasPerspective
        blending: $scope.particle.particleGroup.blending
        transparent: $scope.particle.particleGroup.transparent
        alphaTest: $scope.particle.particleGroup.alphaTest
      emitter:
        todo: 'todo'
    }
    Utils.saveFile(hash, 'particle.save')
