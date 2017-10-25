class ModelViewerScene extends BaseScene

  init: ->
    engine.setWidthHeight(window.innerWidth, window.innerHeight)

    # Helper.desertScene(@scene)

    @light1 = Helper.ambientLight()
    @scene.add @light1

    @light1 = Helper.ambientLight()
    @scene.add @light1
    # hemiLight = Helper.hemiLight()
    # hemiLight.position.set 0, 500, 0
    # @scene.add hemiLight

    bulb = Helper.pointLight(distance: 10)
    bulb.position.set 0, 0, 0
    @scene.add bulb

    bulb = Helper.pointLight(distance: 10)
    bulb.position.set 0, 2, -3
    @scene.add bulb

    dirLight = new (THREE.DirectionalLight)(0xffffff, 1)
    dirLight.color.setHSL 0.1, 1, 0.95
    dirLight.position.set -1, 1.75, 1
    dirLight.position.multiplyScalar 50
    @scene.add dirLight

    @scene.fog = Helper.fog(near: 20, far: 90, color: 'white')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    @engine = Hodler.get().engine

    @engine.camera.position.set 0, 5, 25
    @engine.setClearColor(@scene.fog.color.clone(), 1)

    @controls = Helper.orbitControls(@engine)
    @controls.enabled = true
    @controls.damping = 0.2

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  viewModel: (model) ->
    @scene.remove(@mesh) if @mesh?
    JsonModelManager.get().items[model.key] = undefined
    JsonModelManager.load(model.key, model.libPath, (mesh) =>
      @scene.add mesh

      @baseModel = new BaseModel()
      @baseModel.mesh = mesh

      @mesh = mesh
      @loaded = true
      angular.element(document.getElementById('my-view')).scope().updateAnimations(mesh.animations)
    )

  toggleWireframe: ->
    return unless @baseModel?
    @baseModel.toggleWireframe()

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
