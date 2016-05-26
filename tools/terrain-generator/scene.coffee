class TerrainGeneratorScene extends BaseScene
  init: (options) ->
    engine.setWidthHeight(window.innerWidth - 320, window.innerHeight)
    @scene.fog = Helper.fog(far: 300, color: 'white')
    @grid = Helper.grid(size: 2000, step: 20, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)

    @light1 = Helper.ambientLight()
    @scene.add @light1
    @light2 = Helper.ambientLight()
    @scene.add @light2
    @light3 = Helper.ambientLight()
    @scene.add @light3

    engine.camera.position.set 0, 15, 100
    @controls = Helper.orbitControls(engine)

    Terrain.heightmap(options.texture.libPath, options.heightmap.libPath, options.width, options.height, options.wSegments, options.hSegments, options.scale, @)

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  updateTerrain: (options) ->
    @scene.remove(@terrain.mesh) if @terrain?
    Terrain.heightmap(options.texture.libPath, options.heightmap.libPath, options.width, options.height, options.wSegments, options.hSegments, options.scale, @)

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
