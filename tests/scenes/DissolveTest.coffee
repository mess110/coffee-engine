class DissolveTest extends TestScene
  init: ->
    super()
    box = new (THREE.BoxGeometry)(1, 1, 1)

    @tm.load 'heightmap-lake-taupo', 'assets/heightmap-lake-taupo.png', (texture) ->
      scene = SceneManager.get().currentScene()
      texture = TextureManager.get().items[texture]

      scene.material = Helper.dissolveMaterial(texture)
      scene.scene.add Helper.plane(material: scene.material)

  tick: (tpf) ->
    return unless @material?
    @material.uniforms.dissolve.value += tpf

    if @material.uniforms.dissolve.value > 1
      @material.uniforms.dissolve.value = 0

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
