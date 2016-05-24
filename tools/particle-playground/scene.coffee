class ParticlePlaygroundScene extends BaseScene
  init: ->
    @scene.fog = Helper.fog(far: 40, color: 'black')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)
    engine.camera.position.set 0, 5, 10

    @controls = Helper.orbitControls(engine)

    @particle = new BaseParticle('particle-playground/star.png')
    @scene.add @particle.mesh

    @loaded = true

  uninit: ->
    super()
    @loaded = false
    @controls.enabled = false if @controls?

  tick: (tpf) ->
    return unless @loaded

    @particle.tick(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
