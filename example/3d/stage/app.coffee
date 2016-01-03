config = Config.get()
# config.transparentBackground = true
config.fillWindow()

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
engine = new Engine3D()
engine.setCamera(camera)
engine.camera.position.set 0, 20, 27

# engine.renderer.setClearColor "black", 0
engine.renderer.shadowMapEnabled = true

class LoadingScene extends BaseScene
  spawnBunny: ->
    JsonModelManager.get().load('bunny', 'models/bunny_all.json', (mesh) =>
      mesh.receiveShadow = true
      mesh.castShadow = true
      @bunny = mesh
      @bunny.position.set (Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40
      @bunny.scale.set 0.5, 0.5, 0.5
      @bunny.animations[1].play()
      @bunny.speed = 3

      @bunnies.push @bunny
      @scene.add @bunny
    )

  constructor: ->
    super()

    @ambientLights = [Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight()]

    box = new (THREE.BoxGeometry)(1, 1, 1)
    mat = new (THREE.MeshPhongMaterial)(color: 0xff0000)
    # @scene.fog = new THREE.FogExp2( 0x000000, 0.07 )

    @controls = new (THREE.OrbitControls)(engine.camera)

    @lightCtrl = new LightCtrl()
    @lightCtrl.addAllToScene(@scene)

    @bunnies = []

    @spawnBunny()

    JsonModelManager.get().load('bear', 'models/bear_all.json', (mesh) =>
      mesh.receiveShadow = true
      mesh.castShadow = true
      @bear = mesh
      @bear.position.set 0, 0, 0
      @bear.animations[0].play()
      @bear.speed = 5
      @scene.add @bear
      @lightCtrl.lookAt(@bear) if @bear?

      JsonModelManager.get().load('shotgun', 'models/shotgun.json', (mesh) =>
        mesh.receiveShadow = true
        mesh.castShadow = true
        @shotgun = mesh
        # @shotgun.position.set 0, 0, -10
        @shotgun.animations[1].loop = false
        @shotgun.scale.set 0.3, 0.3, 0.3
        @shotgun.position.set 0, 3, 2.5
        @bear.add @shotgun
      )
    )


    JsonModelManager.get().load('drapes', 'models/drapes.json', (mesh) =>
      mesh.receiveShadow = true
      mesh.castShadow = true
      @drapesBg = mesh
      @drapesBg.position.set 0, 0, -15
      @drapesBg.scale.x = 3.5
      @scene.add @drapesBg
    )

    JsonModelManager.get().load('drapes', 'models/drapes2.json', (mesh) =>
      mesh.receiveShadow = true
      mesh.castShadow = true
      @drapes = mesh
      @drapes.opened = false
      @drapes.position.set 0, 0, 15
      @drapes.scale.x = 2
      @scene.add @drapes
    )

    JsonModelManager.get().load('mask', 'models/theater_mask.json', (mesh) =>
      mesh.receiveShadow = true
      mesh.castShadow = true
      @mask = mesh
      @mask.position.set 0, 16, 16
      @scene.add @mask
    )

    texture = THREE.ImageUtils.loadTexture('models/diffuse.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set 6, 6

    mat = new (THREE.MeshPhongMaterial)(
      shininess: 0
      map: texture
      combine: THREE.MixOperation
      # side: THREE.DoubleSide
      reflectivity: 0.00)

    geometry = new (THREE.PlaneBufferGeometry)(80, 80, 32)
    material = new (THREE.MeshBasicMaterial)(
      color: 0xffff00
      side: THREE.DoubleSide)
    @plane = new (THREE.Mesh)(geometry, mat)
    @plane.receiveShadow = true
    @plane.castShadow = true
    @plane.position.z = -20
    @plane.rotation.set -Math.PI / 2, 0, Math.PI / 2
    @scene.add @plane

    @raycaster = new THREE.Raycaster()

    @loaded = true

  toggleLights: ->
    action = if @lights then 'remove' else 'add'
    for light in @ambientLights
      @scene[action](light)
    @lights = !@lights

  tick: (tpf) ->
    return unless @loaded

    @mask.castShadow = !@drapes.opened if @mask and @drapes

    if @bear? and @shotgun? and @bunnies.any()

      @moving = false

      if @keyboard.pressed(' ') and !@shotgun.animations[1].isPlaying
        @shotgun.animations[1].play()

        matrix = new (THREE.Matrix4)
        matrix.extractRotation @bear.matrix
        direction = new (THREE.Vector3)(0, 0, 1)
        direction.applyMatrix4(matrix)

        @raycaster.set(@bear.position, direction)
        intersects = @raycaster.intersectObjects(@bunnies)
        if intersects.any()
          intersected = intersects.first().object
          asd =
            x: (Math.random() - 0.5) * 40
            y: 0
            z: (Math.random() - 0.5) * 40
          bar =
            x: intersected.position.x
            y: intersected.position.y
            z: intersected.position.z

          tween = new (TWEEN.Tween)(bar).to(asd, 1000).onUpdate(->
            intersected.position.set @x, @y, @z
            return
          ).easing(TWEEN.Easing.Cubic.InOut).start()

          @spawnBunny()
      if @keyboard.pressed('w')
        @moving = true
        @bear.translateZ(tpf * @bear.speed)
      if @keyboard.pressed('s')
        @moving = true
        @bear.translateZ(-tpf * @bear.speed)

      if @keyboard.pressed('a')
        @moving = true
        @bear.rotation.y += tpf * @bear.speed / 2
      if @keyboard.pressed('d')
        @moving = true
        @bear.rotation.y -= tpf * @bear.speed / 2
      @lightCtrl.lookAt(@bear)

      if @bear.animations[0].isPlaying and @moving
        @bear.animations[1].play()
        @bear.animations[0].stop()

      if @bear.animations[1].isPlaying and !@moving
        @bear.animations[0].play()
        @bear.animations[1].stop()

      for bunny in @bunnies
        bunny.lookAt(@bear.position)
        bunny.translateZ(tpf * bunny.speed) if @moving
        if bunny.position.distanceTo(@bear.position) < 3
          location.reload()

        if bunny.animations[0].isPlaying and @moving
          bunny.animations[1].play()
          bunny.animations[0].stop()

        if bunny.animations[1].isPlaying and !@moving
          bunny.animations[0].play()
          bunny.animations[1].stop()

    # if @lastMousePosition?
      # @lightCtrl.lookAt(position: @lastMousePosition)
    # if @keyboard.pressed("l")
    # else
      # @lightCtrl.randomize(tpf)
    # @bear.translateZ(tpf * 3) if @bear?

  doMouseEvent: (event, raycaster) ->
    if event.type == 'mousemove'
      asd = raycaster.intersectObject(@plane)
      if asd.length > 0
        @lastMousePosition = asd[0].point

    # @tweenLookAt(@mask, camera) if @mask?
    # @tweenMoveTo(@mask, camera)

  doKeyboardEvent: (event) ->
    return unless @drapes?

    if event.type == 'keyup' and event.which == 13
      return if @drapes.animations[0].isPlaying
      @drapes.animations[0].play()
      setTimeout =>
        @drapes.opened = !@drapes.opened
      , if @drapes.opened then (@drapes.animations[0].data.length * 1000 - 100) / 3 else (@drapes.animations[0].data.length * 1000 - 100) / 4 * 3 - 150
      setTimeout =>
        @drapes.animations[0].stop()
        @drapes.animations[0].timeScale *= -1
      , @drapes.animations[0].data.length * 1000 - 100

loadingScene = new LoadingScene()
engine.addScene(loadingScene)
engine.render()
