class TestScene extends BaseScene
  init: ->
    Helper.orbitControls(engine)
    @testInfo()

  testInfo: ->
    console.log 'You can add test info by overriding testInfo() method in teh scene'

  uninit: ->
    super()
    @controls.enabled = false if @controls?
    engine.camera.position.set 0, 6.123233995736766e-16, 10
    engine.camera.lookAt 0, 0, 0
