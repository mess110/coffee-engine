class ParticlePlaygroundScene extends BaseScene
  init: (options) ->
    engine.setWidthHeight(window.innerWidth / 2, window.innerHeight)

    @scene.fog = Helper.fog(far: 100, color: 'black')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)
    engine.camera.position.set 0, 40, 100

    @controls = Helper.orbitControls(engine)

    @particle = new BaseParticle2(options)
    @scene.add @particle.mesh

    @loaded = true

  refresh: (json) ->
    @scene.remove @particle.mesh
    @particle = new BaseParticle2(json)
    @scene.add @particle.mesh

  uninit: ->
    super()
    @loaded = false
    @controls.enabled = false if @controls?

  tick: (tpf) ->
    return unless @loaded

    if @particle?
      @particle.tick(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
