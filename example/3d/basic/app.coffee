engine = new Engine3D()
engine.camera.position.z = 110

class LoadingScene extends BaseScene
  constructor: ->
    super()

    @cube = Helper.cube()
    @scene.add @cube

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    @loaded = true

  tick: (tpf) ->
    return unless @loaded

    @cube.rotation.z += 1 * tpf
    @cube.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

loadingScene = new LoadingScene()
engine.addScene(loadingScene)
engine.render()
