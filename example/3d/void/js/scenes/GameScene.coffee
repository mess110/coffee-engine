class GameScene extends BaseScene
  init: ->
    @bunny = JsonModelManager.get().items['bunny']
    @bunny.scale.set 0.5, 0.5, 0.5
    @bunny.receiveShadow = true
    @bunny.castShadow = true
    @scene.add @bunny
    @bunny.add engine.camera

    @water = new Water(engine, @scene)
    @scene.add @water.mesh

    @scene.add Helper.skySphere(textureUrl: 'sky.jpg')

    @mirror = new Mirror(engine, width: 5)
    @cube = Helper.cube(size: 10, material: 'MeshPhongMaterial')
    @cube.position.z = -5.1
    @mirror.mesh.add @cube

    @mirror.mesh.position.set 0, 5, 10
    @mirror.mesh.rotation.x = 0
    @scene.add(@mirror.mesh)

    @scene.add Helper.light()

    asd = @bunny.position.clone()
    asd.z += 10
    asd.y += 10
    engine.camera.lookAt(asd)

    @scene.add Helper.ambientLight()

    # @scene.fog = Helper.fog(far: 400, color: 'white')
    # @scene.add Helper.grid(size: 200, step: 1, color: '#dbdbdb')
    engine.setClearColor( 'white', 1)

    # @plane = Helper.plane(color: 'white', width: 200, height: 200, wSegments: 64, hSegments: 64)
    # @plane.position.y -= 0.1
    # @plane.rotation.x -= Math.PI / 2
    # @scene.add @plane

    json = SaveObjectManager.get().items['terrain']
    @terrain = Terrain.fromJson(json)
    @terrain.mesh.position.y = -0.2
    @terrain.mesh.receiveShadow = true
    @scene.add @terrain.mesh

    # controls = Helper.orbitControls(engine)

  tick: (tpf) ->
    @water.tick(tpf)
    @mirror.tick()

    asd = @bunny.position.clone()
    asd.y = 5
    asd.z = 0
    @mirror.mesh.lookAt(asd)

    height = @terrain.getHeightAt(@bunny.position)
    height = 0 if height <= 0
    @bunny.position.y = height

    walking = false
    if @keyboard.pressed('w') or vj.joystick1.up()
      @bunny.translateZ(tpf * 6)
      walking = true
    if @keyboard.pressed('s') or vj.joystick1.down()
      @bunny.translateZ(-tpf * 6)
      walking = true
    if @keyboard.pressed('d') or vj.joystick1.right()
      @bunny.rotation.y -= tpf
      walking = true
    if @keyboard.pressed('a') or vj.joystick1.left()
      @bunny.rotation.y += tpf
      walking = true

    if walking
      @bunny.animations[0].play()
      # @bunny.animations[1].stop()
    else
      # @bunny.animations[0].stop()
      @bunny.animations[1].play()

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
