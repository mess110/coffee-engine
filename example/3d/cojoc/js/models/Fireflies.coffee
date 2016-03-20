class Fireflies extends BaseParticle
  constructor: (texturePath) ->
    @particleGroup = new (SPE.Group)(
      maxAge: 5
      colorize: true
      hasPerspective: true
      blending: 2 # AdditiveBlending
      transparent: true
      alphaTest: 0.5
      texture: THREE.ImageUtils.loadTexture(texturePath)
    )

    @emitter = new (SPE.Emitter)(
      position: new (THREE.Vector3)(0, 0, 0)
      positionSpread: new (THREE.Vector3)(400, 200, 400)
      velocity: new (THREE.Vector3)(0, 0, 0)
      velocitySpread: new (THREE.Vector3)(10, 3, 10)
      colorStart: new (THREE.Color)('yellow')
      colorEnd: new (THREE.Color)('purple')
      sizeStart: 1
      sizeMiddle: 35
      sizeEnd: 1
      particleCount: 1000)

    @particleGroup.addEmitter @emitter
    @mesh = @particleGroup.mesh
