class Water extends BaseModel
  # '../assets/img/waternormals.jpg'
  constructor: (waterNormalsUrl, engine, scene)->
    waterNormals = new (THREE.ImageUtils.loadTexture)(waterNormalsUrl)
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

    # Create the water effect
    @ms_Water = new (THREE.Water)(engine.renderer, engine.camera, scene,
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
    @mesh = new (THREE.Mesh)(geom, @ms_Water.material)
    @mesh.add @ms_Water
    @mesh.rotation.x = -Math.PI * 0.5

    @speed = 1

  tick: (tpf) ->
    @ms_Water.material.uniforms.time.value += tpf * @speed
