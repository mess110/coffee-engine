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

  $scope.updateColor = (specialColor) ->
    newColor = $scope.options.emitter[specialColor]
    $scope.particle.emitter[specialColor] = new THREE.Color(newColor)

  $scope.$watch 'options.clearColor', (newValue, oldValue) ->
    engine.renderer.setClearColor(newValue)

  $scope.toggleStats = ->
    config.toggleStats()

  $scope.refresh = ->
    json = formatJson()
    particlePlaygroundScene.refresh(json)
    $scope.particle = particlePlaygroundScene.particle

  formatJson = () ->
    {
      group:
        textureUrl: $scope.particle.particleGroup.texture.sourceFile
        maxAge: $scope.particle.particleGroup.maxAge
        colorize: $scope.particle.particleGroup.colorize
        hasPerspective: $scope.particle.particleGroup.hasPerspective
        blending: $scope.particle.particleGroup.blending
        transparent: $scope.particle.particleGroup.transparent
        alphaTest: $scope.particle.particleGroup.alphaTest
        fixedTimeStep: $scope.particle.particleGroup.fixedTimeStep
        fog: $scope.particle.particleGroup.fog
      emitter:
        type: $scope.particle.emitter.type
        position:
          x: $scope.particle.emitter.position.x
          y: $scope.particle.emitter.position.y
          z: $scope.particle.emitter.position.z
        positionSpread:
          x: $scope.particle.emitter.positionSpread.x
          y: $scope.particle.emitter.positionSpread.y
          z: $scope.particle.emitter.positionSpread.z
        acceleration:
          x: $scope.particle.emitter.acceleration.x
          y: $scope.particle.emitter.acceleration.y
          z: $scope.particle.emitter.acceleration.z
        accelerationSpread:
          x: $scope.particle.emitter.accelerationSpread.x
          y: $scope.particle.emitter.accelerationSpread.y
          z: $scope.particle.emitter.accelerationSpread.z
        velocity:
          x: $scope.particle.emitter.velocity.x
          y: $scope.particle.emitter.velocity.y
          z: $scope.particle.emitter.velocity.z
        velocitySpread:
          x: $scope.particle.emitter.velocitySpread.x
          y: $scope.particle.emitter.velocitySpread.y
          z: $scope.particle.emitter.velocitySpread.z
        radius: $scope.particle.emitter.radius
        radiusScale:
          x: $scope.particle.emitter.radiusScale.x
          y: $scope.particle.emitter.radiusScale.y
          z: $scope.particle.emitter.radiusScale.z
        speed: $scope.particle.emitter.speed
        speedSpread: $scope.particle.emitter.speedSpread
        sizeStart: $scope.particle.emitter.sizeStart
        sizeStartSpread: $scope.particle.emitter.sizeStartSpread
        sizeMiddle: $scope.particle.emitter.sizeMiddle
        sizeMiddleSpread: $scope.particle.emitter.sizeMiddleSpread
        sizeEnd: $scope.particle.emitter.sizeEnd
        sizeEndSpread: $scope.particle.emitter.sizeEndSpread
        angleStart: $scope.particle.emitter.angleStart
        angleStartSpread: $scope.particle.emitter.angleStartSpread
        angleMiddle: $scope.particle.emitter.angleMiddle
        angleMiddleSpread: $scope.particle.emitter.angleMiddleSpread
        angleEnd: $scope.particle.emitter.angleEnd
        angleEndSpread: $scope.particle.emitter.angleEndSpread
        angleAlignVelocity: $scope.particle.emitter.angleAlignVelocity
        colorStart: "##{$scope.particle.emitter.colorStart.getHexString()}"
        colorStartSpread:
          x: $scope.particle.emitter.colorStartSpread.x
          y: $scope.particle.emitter.colorStartSpread.y
          z: $scope.particle.emitter.colorStartSpread.z
        colorMiddle: "##{$scope.particle.emitter.colorMiddle.getHexString()}"
        colorMiddleSpread:
          x: $scope.particle.emitter.colorMiddleSpread.x
          y: $scope.particle.emitter.colorMiddleSpread.y
          z: $scope.particle.emitter.colorMiddleSpread.z
        colorEnd: "##{$scope.particle.emitter.colorEnd.getHexString()}"
        colorEndSpread:
          x: $scope.particle.emitter.colorEndSpread.x
          y: $scope.particle.emitter.colorEndSpread.y
          z: $scope.particle.emitter.colorEndSpread.z
        opacityStart: $scope.particle.emitter.opacityStart
        opacityStartSpread: $scope.particle.emitter.opacityStartSpread
        opacityMiddle: $scope.particle.emitter.opacityMiddle
        opacityMiddleSpread: $scope.particle.emitter.opacityMiddleSpread
        opacityEnd: $scope.particle.emitter.opacityEnd
        opacityEndSpread: $scope.particle.emitter.opacityEndSpread
        particlesPerSecond: $scope.particle.emitter.particlesPerSecond
        emitterDuration: $scope.particle.emitter.emitterDuration
        alive: $scope.particle.emitter.alive
        isStatic: $scope.particle.emitter.isStatic
    }

  $scope.saveJson = ->
    hash = formatJson()
    Utils.saveFile(hash, 'particle.save')
