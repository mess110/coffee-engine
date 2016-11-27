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
    json = {}
    if typeof(texturePath) == 'string'
      json =
        group:
          texture: THREE.ImageUtils.loadTexture(texturePath)
    else
      json = texturePath
      json.group ?= {}
      json.group.asset ?= {}
      throw new Error('json.group.asset.libPath is required') unless json.group.asset.libPath?
      key = Utils.getKeyName(json.group.asset.libPath, Utils.IMG_URLS)
      json.group.texture = TextureManager.get().items[key]

    json = @formatDefaults(json)

    @particleGroup = new (SPE.Group)(json.group)

    for key of json.emitter
      if typeof json.emitter[key] == 'object'
        continue unless json.emitter[key]?
        if json.emitter[key].x?
          json.emitter[key] = Helper.toVector3(json.emitter[key])
    for key in ['colorStart', 'colorMiddle', 'colorEnd']
      json.emitter[key] = new (THREE.Color)(json.emitter[key]) if json.emitter[key]?

    @emitter = new (SPE.Emitter)(json.emitter)

    @particleGroup.addEmitter @emitter
    @mesh = @particleGroup.mesh

  # @see https://github.com/squarefeet/ShaderParticleEngine/tree/Release-0.8.1
  formatDefaults: (json = {}) ->
    json.group ?= {}
    json.group.maxParticleCount ?= 100
    json.group.maxAge ?= 3
    json.group.hasPerspective ?= true
    json.group.colorize ?= true
    json.group.blending ?= 2 # AdditiveBlending
    json.group.transparent ?= true
    json.group.alphaTest ?= 0.5
    json.group.depthWrite ?= false
    json.group.depthTest ?= true
    json.group.fixedTimeStep ?= 0.016 if json.group.fixedTimeStep?
    json.group.fog ?= true

    json.emitter ?= {}
    json.emitter.type ?= 'cube'
    for attr in ['position', 'positionSpread', 'acceleration', 'accelerationSpread', 'velocity', 'velocitySpread']
      json.emitter[attr] ?= {}
      for coord in ['x', 'y', 'z']
        json.emitter[attr][coord] ?= 0
    json.emitter.radius ?= 10
    json.emitter.radiusScale ?= {}
    json.emitter.radiusScale.x ?= 1
    json.emitter.radiusScale.y ?= 1
    json.emitter.radiusScale.z ?= 1
    json.emitter.speed ?= 0
    json.emitter.speedSpread ?= 0
    json.emitter.sizeStart ?= 10
    json.emitter.sizeStartSpread ?= 0
    json.emitter.sizeMiddle ?= 10
    json.emitter.sizeMiddleSpread ?= 0
    json.emitter.sizeEnd ?= 10
    json.emitter.sizeEndSpread ?= 0
    json.emitter.angleStart ?= 0
    json.emitter.angleStartSpread ?= 0
    json.emitter.angleMiddle ?= 0
    json.emitter.angleMiddleSpread ?= 0
    json.emitter.angleEnd ?= 0
    json.emitter.angleEndSpread ?= 0
    json.emitter.angleAlignVelocity ?= false # not implemented, implement it
    json.emitter.colorStart ?= 'white'
    json.emitter.colorStartSpread ?= {}
    json.emitter.colorStartSpread.x ?= 0
    json.emitter.colorStartSpread.y ?= 0
    json.emitter.colorStartSpread.z ?= 0
    json.emitter.colorMiddle ?= 'white'
    json.emitter.colorMiddleSpread ?= {}
    json.emitter.colorMiddleSpread.x ?= 0
    json.emitter.colorMiddleSpread.y ?= 0
    json.emitter.colorMiddleSpread.z ?= 0
    json.emitter.colorEnd ?= 'blue'
    json.emitter.colorEndSpread ?= {}
    json.emitter.colorEndSpread.x ?= 0
    json.emitter.colorEndSpread.y ?= 0
    json.emitter.colorEndSpread.z ?= 0
    json.emitter.opacityStart ?= 1
    json.emitter.opacityStartSpread ?= 0
    json.emitter.opacityMiddle ?= 0.5
    json.emitter.opacityMiddleSpread ?= 0
    json.emitter.opacityEnd ?= 0
    json.emitter.opacityEndSpread ?= 0
    json.emitter.particlesPerSecond ?= 100
    json.emitter.emitterDuration ?= null
    json.emitter.alive ?= 1.0
    json.emitter.isStatic ?= 0

    json

  # Used to animate the particle
  #
  # Should normally be called in scene.tick
  tick: (tpf) ->
    @particleGroup.tick(tpf)

  # Load particle with TextureManager
  @fromJson = (assetJson) ->
    throw new Error('not a particle') if assetJson.type != 'particle'
    throw new Error('key missing') unless assetJson.key?

    json = SaveObjectManager.get().items[assetJson.key]
    new BaseParticle(json)
