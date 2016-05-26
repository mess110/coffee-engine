class ParticlePlaygroundScene extends BaseScene
  init: (options) ->
    engine.setWidthHeight(window.innerWidth - 320, window.innerHeight)

    @scene.fog = Helper.fog(far: 100, color: 'black')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)
    engine.camera.position.set 0, 5, 50

    @controls = Helper.orbitControls(engine)

    url = options.url
    TextureManager.get().load('star', url)

    @particle = new BaseParticle(url)
    @scene.add @particle.mesh

    @loaded = true

  refresh: (json) ->
    @scene.remove(@particle.mesh)
    part = BaseParticle.fromJson(json)
    @scene.add part.mesh
    @particle = part

  uninit: ->
    super()
    @loaded = false
    @controls.enabled = false if @controls?

  tick: (tpf) ->
    return unless @loaded

    @particle.tick(tpf) if @particle?

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
