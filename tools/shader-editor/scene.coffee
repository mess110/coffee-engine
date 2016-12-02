class ShaderEditorScene extends BaseScene
  init: ->
    @scene.fog = Helper.fog(far: 100, color: 'black')
    @grid = Helper.grid(size: 200, step: 10, color: 'gray')
    @scene.add @grid
    engine.setClearColor(@scene.fog.color, 1)
    engine.camera.position.set 0, 5, 10
    engine.setWidthHeight(window.innerWidth / 2, window.innerHeight)

    @controls = Helper.orbitControls(engine)
    @controls.enabled = true
    @controls.enablePan = false
    @controls.damping = 0.2

  setShader: (shader)->
    @shader = shader
    @scene.remove @item if @item?

    eval("var evalUniforms = #{shader.uniforms}")
    @itemMaterial = new (THREE.ShaderMaterial)(
      uniforms: evalUniforms
      vertexShader: shader.vertex
      fragmentShader: shader.fragment
    )
    if evalUniforms.texture1?
      evalUniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping
      evalUniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping

    # uniforms = {
      # fogDensity: { value: 0.45 },
      # fogColor:   { value: new THREE.Vector3( 0, 0, 0 ) },
      # time:       { value: 1.0 },
      # resolution: { value: new THREE.Vector2() },
      # uvScale:    { value: new THREE.Vector2( 3.0, 1.0 ) },
      # texture1:   { value: THREE.ImageUtils.loadTexture( "../workspace/lib/textures/cloud.png" ) },
      # texture2:   { value: THREE.ImageUtils.loadTexture( "../workspace/lib/textures/lavatile.jpg" ) }
    # }

    @item = new (THREE.Mesh)(new (THREE.BoxGeometry)(1, 1, 1), @itemMaterial)
    @scene.add @item

    @loaded = true

  uninit: ->
    super()
    @controls.enabled = false if @controls?

  tick: (tpf) ->
    return unless @loaded

    @itemMaterial.uniforms.time.value += tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
