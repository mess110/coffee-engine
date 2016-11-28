class ShaderTest extends TestScene
  init: ->
    super()
    @shader = Helper.sampleShader()
    @scene.add @shader

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

  tick: (tpf) ->
    @shader.shaderSrc.uniforms.time.value += tpf * 10

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
