Config.get().toggleDebug()
engine = new Engine3D()

class GameScene extends BaseScene
  init: ->
    @cube = Helper.cube(size: 1, material: 'MeshPhongMaterial')
    @scene.add @cube

    @scene.add Helper.ambientLight()

  tick: (tpf) ->
    @cube.rotation.z += 1 * tpf
    @cube.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

gameScene = new GameScene()
loadingScene = new LoadingScene(['sword.json', 'sword.png'], () ->
  gameScene.init()
  engine.sceneManager.setScene(gameScene)
)

engine.addScene(loadingScene)
engine.addScene(gameScene)
engine.render()
