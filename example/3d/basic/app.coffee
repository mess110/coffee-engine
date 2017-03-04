config = Config.get()

# config.toggleDebug()
# config.toggleStats()
config.fillWindow()

engine = new Engine3D()

class GameScene extends BaseScene
  init: ->
    @cube = Helper.cube(size: 1, material: 'MeshPhongMaterial')
    @scene.add @cube

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

  tick: (tpf) ->
    @cube.rotation.z += 1 * tpf
    @cube.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

Engine3D.scenify(engine, ->
  gameScene = new GameScene()
  engine.initScene(gameScene)
)

engine.start()
