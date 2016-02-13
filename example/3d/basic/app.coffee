Config.get().toggleDebug()
engine = new Engine3D()
# engine.setClearColor('white')

class GameScene extends BaseScene
  init: ->
    @cube = Helper.cube()
    @scene.add @cube

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    engine.camera.lookAt(@cube)

    @scene.add JsonModelManager.get().models['sword']

  tick: (tpf) ->
    @cube.rotation.z += 1 * tpf
    @cube.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

gameScene = new GameScene()
loadingScene = new LoadingScene(['sword.json'], () ->
  gameScene.init()
  engine.sceneManager.setScene(gameScene)
)

engine.addScene(loadingScene)
engine.addScene(gameScene)
engine.render()
