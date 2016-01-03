config = Config.get()
config.fillWindow()

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
engine = new Engine3D()
engine.setCamera(camera)
camera.position.set 0, 20, 27
camera.lookAt(new (THREE.Vector3)(0, 0, 0))

SoundManager.get().add('shotgun', 'shotgun.wav')
SoundManager.get().add('hit', 'hit.wav')

engine.renderer.shadowMapEnabled = true

class LoadingScene extends BaseScene

  getRandomArbitrary: (min, max) ->
    Math.random() * (max - min) + min

  spawnBunny: ->
    JsonModelManager.get().load('bunny', 'models/bunny_all.json', (mesh) =>
      mesh.receiveShadow = true
      mesh.castShadow = true
      @bunny = mesh
      @bunny.position.copy @getBunnySpawnPoint()
      @bunny.scale.set 0.5, 0.5, 0.5
      @bunny.animations[1].play()
      @bunny.speed = 3
      @bunny.dead = false

      @bunnies.push @bunny
      @scene.add @bunny
    )

  cameraPosition: (i = 0) ->
    e = [
      { x: 0, y: 20, z: 27 }
      { x: 0, y: 33, z: 0 }
    ][i]

    @tweenMoveTo({ position: new (THREE.Vector3)(e.x, e.y, e.z) }, camera, 500)
    setTimeout =>
      @tweenLookAt({ position: new (THREE.Vector3)(0, 0, 0) }, camera, 500)
    , 501

  getBunnySpawnPoint: () ->
    angle = Math.random()*Math.PI*2
    radius = @getRandomArbitrary(20, 30)

    {
      x: Math.cos(angle) * radius
      y: 0
      z: Math.sin(angle) * radius
    }

  constructor: ->
    super()

    @score = 0
    @ambientLights = [Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight()]

    box = new (THREE.BoxGeometry)(1, 1, 1)
    mat = new (THREE.MeshPhongMaterial)(color: 0xff0000)
    # @scene.fog = new THREE.FogExp2( 0x000000, 0.07 )

    # @controls = new (THREE.OrbitControls)(engine.camera)

    @lightCtrl = new LightCtrl()
    @lightCtrl.addAllToScene(@scene)

    @bunnies = []
    @started = false

    # for i in [1..40]
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
      @cameraPosition(0)

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


    geometry = new (THREE.PlaneGeometry)(80, 80, 32)
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
    return if @gameOver

    @mask.castShadow = !@drapes.opened if @mask and @drapes

    if @bear? and @shotgun? and @bunnies.any()

      @moving = false

      if @keyboard.pressed(' ') and !@shotgun.animations[1].isPlaying
        @shotgun.animations[1].play()
        snd = SoundManager.get().sounds['shotgun']
        snd.volume = 0.4
        snd.playbackRate = 1.3
        snd.play('shotgun')

        return if not @started

        matrix = new (THREE.Matrix4)
        matrix.extractRotation @bear.matrix
        direction = new (THREE.Vector3)(0, 0, 1)
        direction.applyMatrix4(matrix)

        @raycaster.set(@bear.position, direction)
        intersects = @raycaster.intersectObjects(@bunnies)
        if intersects.any()
          geometry = new (THREE.Geometry)
          geometry.vertices.push @bear.position
          geometry.vertices.push intersects[0].point
          @scene.remove @line
          @line = new (THREE.Line)(geometry, new (THREE.LineBasicMaterial)(color: 'black'))
          @scene.add @line

          SoundManager.get().play('hit')
          @score += 1
          document.getElementById('count').innerHTML = @score
          intersected = intersects.first().object
          asd = @getBunnySpawnPoint()
          bar = intersected.position.clone()

          intersected.dead = true

          tween = new (TWEEN.Tween)(bar).to(asd, 1000).onUpdate(->
            intersected.position.set @x, @y, @z
            intersected.rotation.y += 0.1
            return
          ).easing(TWEEN.Easing.Cubic.InOut).start()
          setTimeout =>
            intersected.dead = false
          , 1000

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
        bunny.lookAt(@bear.position) if not bunny.dead
        bunny.translateZ(tpf * bunny.speed) if @moving
        if bunny.position.distanceTo(@bear.position) < 3 and not bunny.dead
          @gameOver = true
          location.reload()

        if bunny.animations[0].isPlaying and @moving
          bunny.animations[1].play()
          bunny.animations[0].stop()

        if bunny.animations[1].isPlaying and !@moving
          bunny.animations[0].play()
          bunny.animations[1].stop()

  toggleDrapes: ->
    return if @drapes.animations[0].isPlaying
    @started = true
    @drapes.animations[0].play()
    setTimeout =>
      @drapes.opened = !@drapes.opened
    , if @drapes.opened then (@drapes.animations[0].data.length * 1000 - 100) / 3 else (@drapes.animations[0].data.length * 1000 - 100) / 4 * 3 - 150
    setTimeout =>
      @drapes.animations[0].stop()
      @drapes.animations[0].timeScale *= -1
    , @drapes.animations[0].data.length * 1000 - 100

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
    return unless event.type == 'keyup'
    return unless @drapes?

    @cameraPosition(0) if event.which == 49
    @cameraPosition(1) if event.which == 50

    @toggleDrapes() if event.which == 32 and not @started

loadingScene = new LoadingScene()
engine.addScene(loadingScene)
engine.render()
