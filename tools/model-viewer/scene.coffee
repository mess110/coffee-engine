class ModelViewerScene extends BaseScene

  init: ->
    @light1 = Helper.ambientLight()
    @scene.add @light1
    @light2 = Helper.ambientLight()
    @scene.add @light2
    @light3 = Helper.ambientLight()
    @scene.add @light3
    @light4 = Helper.ambientLight()
    @scene.add @light4

    @scene.fog = Helper.fog(far: 70, color: 'white')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    @engine = EngineHolder.get().engine

    engine.camera.position.set 0, 5, 10
    @engine.setClearColor(@scene.fog.color, 1)

    @controls = Helper.orbitControls(@engine)
    @controls.enabled = true
    @controls.damping = 0.2

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  viewModel: (name, url) ->
    @scene.remove(@mesh) if @mesh?
    JsonModelManager.get().items[name] = undefined
    JsonModelManager.get().load(name, url, (mesh) =>
      @scene.add mesh
      @mesh = mesh
      @loaded = true
      angular.element(document.getElementById('my-view')).scope().updateAnimations(mesh.animations)
    )

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
