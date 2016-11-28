class ShaderEditorScene extends BaseScene
  init: ->
    @scene.fog = Helper.fog(far: 100, color: 'black')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)
    engine.camera.position.set 0, 5, 10
    # engine.setWidthHeight(window.innerWidth / 2, window.innerHeight)

    @controls = Helper.orbitControls(engine)
    @controls.enabled = true
    @controls.enablePan = false
    @controls.damping = 0.2

  setShader: (shader)->
    @shader = shader
    @scene.remove @item if @item?

    itemMaterial = new (THREE.ShaderMaterial)(
      uniforms: shader.uniforms
      vertexShader: shader.vertex
      fragmentShader: shader.fragment
    )
    @item = new (THREE.Mesh)(new (THREE.BoxGeometry)(1, 1, 1), itemMaterial)
    @scene.add @item

    @loaded = true

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  tick: (tpf) ->
    return unless @loaded

    @shader.uniforms.time.value += tpf * 10

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
