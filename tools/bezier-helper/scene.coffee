class BezierScene extends BaseScene

  init: ->
    engine.setWidthHeight(window.innerWidth, window.innerHeight - 276 - 80)

    @engine = EngineHolder.get().engine

    @light1 = Helper.ambientLight()
    @scene.add @light1

    @scene.fog = Helper.fog(far: 70, color: 'white')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    @engine.setClearColor(@scene.fog.color, 1)
    @engine.camera.position.set 0, 0, 11

    @art = new ArtGenerator(width: 512, height: 512)

    @plane = new BaseModel()
    @plane.mesh = Helper.plane(width: 10, height: 10, wSegments: 20, hSegments: 20)
    @scene.add @plane.mesh

    @controls = Helper.orbitControls(@engine)
    @controls.damping = 0.2

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  toggleWireframe: () ->
    @plane.toggleWireframe()

  updateCurve: (json) ->
    @art.fromJson(items: [json])
    material = Helper.materialFromCanvas(@art.canvas)
    material.map.minFilter = THREE.LinearFilter
    @plane.mesh.material = material

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
