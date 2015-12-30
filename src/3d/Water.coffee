# Used to generate water
#
# @example
#   water = new Water('/bower_components/ocean/assets/img/waternormals.jpg', engine, @)
#   @scene.add water.mesh
#
#   water.tick(tpf)
class Water extends BaseModel
  constructor: (waterNormalsUrl, engine, scene)->
    waterNormals = new (THREE.ImageUtils.loadTexture)(waterNormalsUrl)
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

    # Create the water effect
    @water = new (THREE.Water)(engine.renderer, engine.camera, scene,
      textureWidth: 256
      textureHeight: 256
      waterNormals: waterNormals
      alpha: 1.0
      # sunDirection: .position.normalize()
      sunColor: 0xffffff
      waterColor: 0x001e0f
      betaVersion: 0
      side: THREE.DoubleSide
    )

    geom = new (THREE.PlaneBufferGeometry)(2000, 2000, 10, 10)
    @mesh = new (THREE.Mesh)(geom, @water.material)
    @mesh.add @water
    @mesh.rotation.x = -Math.PI * 0.5

    @speed = 1

  tick: (tpf) ->
    # @water.render()
    # @water.material.uniforms.time.value += 1.0 / 60.0
    @water.material.uniforms.time.value += tpf * @speed
