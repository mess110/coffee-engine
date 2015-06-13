engine = new Engine2D('canvas', 640, 480, true)

class GameScene extends BaseScene
  tick: (tpf) ->
    @engine.clear()
    @drawText(Math.round(1 / tpf) + 'fps')

  doMouseEvent: (event) ->

  doKeyboardEvent: (event) ->

scene = new GameScene(engine)

SceneManager.get().addScene(scene)
SceneManager.get().setScene(scene)

engine.render()
