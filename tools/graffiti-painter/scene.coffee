class GraffitiPainterScene extends BaseScene

  init: (options) ->
    engine.setWidthHeight(window.innerWidth, window.innerHeight)

    @light1 = Helper.ambientLight()
    @scene.add @light1

    @scene.fog = Helper.fog(far: 90, color: 'white')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    @engine = EngineHolder.get().engine

    engine.camera.position.set 0, 5, 25
    @engine.setClearColor(@scene.fog.color, 1)

    @options = options
    @plane = new BaseModel()
    @plane.mesh = Helper.plane(@options.plane)
    @scene.add @plane.mesh

    @controls = Helper.orbitControls(@engine)
    @controls.enabled = true
    @controls.damping = 0.2
    @controls.noPan = true

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  tick: (tpf) ->
    return unless @loaded

  refresh: (json) ->
    @art = new ArtGenerator(width: json.width, height: json.height)
    @art.fromJson(json)

    material = Helper.materialFromCanvas(@art.canvas)
    material.map.minFilter = THREE.LinearFilter

    if json.plane != @options
      @scene.remove @plane.mesh
      @plane.mesh = Helper.plane(json.plane)
      @scene.add @plane.mesh

    @plane.mesh.material = material

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
