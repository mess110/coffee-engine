# Mirror helper
#
# @example
#   mirror = new Mirror(engine)
#   scene.add(mirror.mesh)
#
#   # in scene.tick()
#   mirror.tick()
class Mirror extends BaseModel
  # Create a mirror
  constructor: (engine) ->
    planeGeo = new (THREE.PlaneBufferGeometry)(100.1, 100.1)
    @mirror = new THREE.Mirror( engine.renderer, engine.camera, { clipBias: 0.003, textureWidth: 512, textureHeight: 512, color: 0x777777 } )
    @mesh = new (THREE.Mesh)(planeGeo, @mirror.material)
    @mesh.add @mirror
    @mesh.rotateX -Math.PI / 2

  # Used to update the mirror reflection
  #
  # Should be called in scene.tick
  tick: ->
    @mirror.render()
