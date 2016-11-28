class BasicTest extends TestScene
  init: ->
    super()
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
