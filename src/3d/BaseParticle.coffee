# This is a basic pre-configured particle which looks like a volcano.
#
# @see https://github.com/squarefeet/ShaderParticleEngine/tree/Release-0.8.1#usage
# @example
#   @particle = new BaseParticle('./imgs/star.png')
#   @scene.add @particle.mesh
#
#   @particle.tick(tpf)
class BaseParticle extends BaseModel

  # create the particle
  constructor: (texturePath) ->

    @particleGroup = new (SPE.Group)(
      texture: THREE.ImageUtils.loadTexture(texturePath)
      maxAge: 0.2
      hasPerspective: true
      colorize: true
    )

    @emitter = new (SPE.Emitter)(
      position: new (THREE.Vector3)(0, 0, 0)
      positionSpread: new (THREE.Vector3)(0, 0, 0)
      acceleration: new (THREE.Vector3)(0, -10, 0)
      accelerationSpread: new (THREE.Vector3)(10, 0, 10)
      velocity: new (THREE.Vector3)(0, 25, 0)
      velocitySpread: new (THREE.Vector3)(10, 7.5, 10)
      colorStart: new (THREE.Color)('white')
      colorEnd: new (THREE.Color)('red')
      sizeStart: 1
      sizeEnd: 1
      particleCount: 2000)

    @particleGroup.addEmitter @emitter
    @mesh = @particleGroup.mesh

  # Used to animate the particle
  #
  # Should normally be called in scene.tick
  tick: (tpf) ->
    @particleGroup.tick(tpf)
