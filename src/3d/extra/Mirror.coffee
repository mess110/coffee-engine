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
    options.width ?= 10
    options.height ?= 10
    options.mirror ?= {}
    options.mirror.clipBias ?= 0.003
    options.mirror.textureHeight ?= 512
    options.mirror.textureHeight ?= 512
    options.mirror.color ?= 0x777777

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
