engine = new Engine3D()
engine.camera.position.z = 110

class LoadingScene extends BaseScene
  constructor: ->
    super()

    @cube = Helper.cube()
    @scene.add @cube

    @light = Helper.ambientLight()
    @scene.add @light

    # @water = new Water('/bower_components/ocean/assets/img/waternormals.jpg', engine, @)
    # @water.mesh.position.y = -5
    # @scene.add @water.mesh
    # @water.tick(tpf)

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
