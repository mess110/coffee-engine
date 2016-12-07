class MenuScene extends BaseScene
  init: (options) ->
    @landingModel = new LandingModel()
    @scene.add @landingModel.model

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    light = new (THREE.SpotLight)
    light.position.copy new THREE.Vector3(0, 0, 10)
    light.intensity = 1.25
    light.lookAt(@landingModel.mesh)
    @scene.add light

  tick: (tpf) ->
    @landingModel.tick(tpf)

  doKeyboardEvent: (event) ->

  doMouseEvent: (event, raycaster) ->
