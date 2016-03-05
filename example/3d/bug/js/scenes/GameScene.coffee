class GameScene extends BaseScene
  jmm: JsonModelManager.get()

  init: ->
    engine.camera.position.set 0, 10, 15

    @bear = @jmm.clone('bear_all')
    @bear.animations[0].play()
    @scene.add @bear

    @bear2 = @jmm.clone('bear_all')
    @bear2.animations[1].play()
    @bear2.position.set 0, 10, 0
    @scene.add @bear2

    @scene.add Helper.ambientLight()

    # @controls = new THREE.MotionControls( engine.camera )
    @controls = Helper.orbitControls(engine)

  tick: (tpf) ->
    # @controls.update()
    # console.log @controls.orientation

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
