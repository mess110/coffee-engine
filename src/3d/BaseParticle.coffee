# This is a basic pre-configured particle which looks like a volcano.
#
# @see https://github.com/squarefeet/ShaderParticleEngine/tree/Release-0.8.1#usage
# @example
#   @particle = new BaseParticle('./imgs/star.png')
#   @scene.add @particle.mesh
#
#   @particle.tick(tpf)
#
# @example
#   @particle = BaseParticle.fromJson(json)
#   @scene.add @particle.mesh
#
#   @particle.tick(tpf)
#
# @see https://squarefeet.github.io/ShaderParticleEngine/
class BaseParticle extends BaseModel

  # create the particle
  #
  # If texturePath is a json object, it will use the TextureManager, otherwise
  # it will load as an image
  #
  # @param [String] texturePath
  constructor: (texturePath) ->
    if typeof(texturePath) == 'string'
      json =
        group:
          maxAge: 0.2
          colorize: true
          hasPerspective: true
          blending: 2 # AdditiveBlending
          transparent: true
          alphaTest: 0.5
          texture: THREE.ImageUtils.loadTexture(texturePath)
    else
      json = texturePath
      key = Utils.getKeyName(json.group.textureUrl, Utils.IMG_URLS)
      json.group.texture = TextureManager.get().items[key]

    @particleGroup = new (SPE.Group)(json.group)

    # TODO: ability to save
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

  # Load particle with TextureManager
  @fromJson = (json) ->
    new BaseParticle(json)
