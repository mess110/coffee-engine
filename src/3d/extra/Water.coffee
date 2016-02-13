# Used to generate water
#
# @example
#   water = new Water('/bower_components/ocean/assets/img/waternormals.jpg', engine, @scene, 2000, 10)
#   @scene.add water.mesh
#
#   water.tick(tpf)
#
# @see https://github.com/jbouny/ocean
class Water extends BaseModel
  # Create water
  constructor: (waterNormalsUrl, engine, scene, size, segments)->
    waterNormals = new (THREE.ImageUtils.loadTexture)('/bower_components/ocean/assets/img/waternormals.jpg')
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

    @water = new (THREE.Water)(engine.renderer, engine.camera, scene,
      textureWidth: 256
      textureHeight: 256
      waterNormals: waterNormals
      alpha: 1.0
      # sunDirection: light.position.normalize()
      sunColor: 0xffffff
      waterColor: 0x001e0f
      betaVersion: 0
      side: THREE.DoubleSide)

    @mesh = new (THREE.Mesh)(new (THREE.PlaneBufferGeometry)(size, size, segments, segments), @water.material)
    @mesh.add @water
    @mesh.rotation.x = -Math.PI * 0.5

    @speed = 1

  # Used to update the water animation.
  #
  # Should be called in scene.tick
  tick: (tpf) ->
    @water.material.uniforms.time.value += tpf * @speed
    @water.render()
