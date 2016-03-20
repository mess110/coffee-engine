class MenuScene extends BaseScene
  init: ->
    @particle = new Fireflies('assets/spark.png')
    @scene.add @particle.mesh

    engine.camera.position.set 0, 0, 200

  tick: (tpf) ->
    @particle.tick(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
