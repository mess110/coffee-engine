# Mirror helper
#
# @example
#   @mirror = new Mirror(engine)
#   scene.add(@mirror.mesh)
#
#   @mirror.tick()
class Mirror extends BaseModel
  # Create a mirror
  constructor: (engine, options = {}) ->
    options.width ?= Utils.PLANE_DEFAULT_WIDTH
    options.height ?= Utils.PLANE_DEFAULT_HEIGHT
    options.mirror ?= {}
    options.mirror.clipBias ?= Utils.MIRROR_DEFAULT_CLIP_BIAS
    options.mirror.textureWidth ?= Utils.MIRROR_DEFAULT_TEXTURE_WIDTH
    options.mirror.textureHeight ?= Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT
    options.mirror.color ?= Utils.MIRROR_DEFAULT_COLOR

    planeGeo = new (THREE.PlaneBufferGeometry)(options.width, options.height)
    @mirror = new THREE.Mirror(engine.renderer, engine.camera, options.mirror)
    @mesh = new (THREE.Mesh)(planeGeo, @mirror.material)
    @mesh.add @mirror
    @mesh.rotateX -Math.PI / 2

  # Used to update the mirror reflection
  #
  # Should be called in scene.tick
  tick: ->
    @mirror.render()
