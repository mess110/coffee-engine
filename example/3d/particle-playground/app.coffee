app = angular.module('app', [])

app.controller 'MainController', ($scope) ->
  $scope.options =
    clearColor: '#000000'
    emitter:
      colorStart: '#ff0000'
      colorMiddle: '#ffffff'
      colorEnd: '#0000ff'

  $scope.particle = particlePlaygroundScene.particle
  console.log $scope.particle

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


class ParticlePlaygroundScene extends BaseScene
  constructor: ->
    super()

    @controls = Helper.orbitControls(engine)

    @particle = new BaseParticle('star.png')
    @scene.add @particle.mesh

    @loaded = true

  tick: (tpf) ->
    return unless @loaded

    @particle.tick(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

config = Config.get()
config.fillWindow()
config.preventDefaultMouseEvents = false
config.width = config.width * 6 / 10

engine = new Engine3D()
engine.camera.position.set 0, 5, 10

particlePlaygroundScene = new ParticlePlaygroundScene()
engine.addScene(particlePlaygroundScene)
engine.render()
