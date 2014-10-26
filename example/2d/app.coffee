engine = new Engine2D('game', 640, 480)

class GameScene extends BaseScene
  tick: (tpf) ->
    @engine.clear()
    @drawText(Math.round(1 / tpf) + 'fps')

  doMouseEvent: (event) ->
    console.log event

  doKeyboardEvent: (event) ->
    console.log event

scene = new GameScene(engine)

SceneManager.get().addScene(scene)
SceneManager.get().setScene(scene)

engine.render()
