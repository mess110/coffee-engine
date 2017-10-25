Ammo().then((Ammo) ->
  config = Config.get()

  # config.toggleDebug()
  config.toggleStats()
  config.fillWindow()
  engine = new Engine3D()
  engine.renderer.setPixelRatio( window.devicePixelRatio )

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 )
  camera.position.x = -4.84
  camera.position.y = 4.39
  camera.position.z = -35.11
  camera.lookAt( new THREE.Vector3( 0.33, -0.40, 0.85 ) )
  engine.setCamera(camera)

  camera2 = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 )
  camera2.position.set(0, 3, -7)
  camera2.lookAt(Helper.zero)

  class GameScene extends BaseScene

    init: ->
      @ZERO_QUATERNION = new (THREE.Quaternion)(0, 0, 0, 1)

      @actions = {}
      @keysActions =
        'KeyW': 'acceleration'
        'KeyS': 'braking'
        'KeyA': 'left'
        'KeyD': 'right'
      @boxes = []

      engine.setClearColor( 0xbfd1e5 )

      Helper.orbitControls(engine)

      @initGraphics()
      @physicsWorld = Helper.physicsWorld()
      @createObjects()

      @setCamera(2)

    initGraphics: ->
      ambientLight = new (THREE.AmbientLight)(0x404040)
      @scene.add ambientLight

      dirLight = new (THREE.DirectionalLight)(0xffffff, 1)
      dirLight.position.set 10, 10, 5
      @scene.add dirLight

      MaterialManager.load('materialDynamic', new (THREE.MeshPhongMaterial)(color: 0xfca400))
      MaterialManager.load('materialStatic', new (THREE.MeshPhongMaterial)(color: 0x999999))
      MaterialManager.load('materialInteractive', new (THREE.MeshPhongMaterial)(color: 0x990000))

    createObjects: ->
      @terrain = new PhysicsTerrain(@physicsWorld)
      @scene.add @terrain.mesh

      # Shifts the terrain, since bullet re-centers it on its bounding box.

      # @boxes.push(new Box(new (THREE.Vector3)(0, -0.5, 0), @ZERO_QUATERNION, 75, 1, 75, 0, 2))

      quaternion = new (THREE.Quaternion)(0, 0, 0, 1)
      quaternion.setFromAxisAngle new (THREE.Vector3)(1, 0, 0), -Math.PI / 18
      @boxes.push(new Box(new (THREE.Vector3)(0, -1.5, 0), quaternion, 8, 4, 10, 0, undefined))
      size = .75
      nw = 8
      nh = 6
      j = 0
      while j < nw
        i = 0
        while i < nh
          @boxes.push(new Box(new (THREE.Vector3)(size * j - (size * (nw - 1) / 2), size * i, 10), @ZERO_QUATERNION, size, size, size, 10, undefined))
          i++
        j++

      for box in @boxes
        @scene.add box.mesh
        @physicsWorld.addRigidBody box.body

      @vehicle = new Vehicle(new (THREE.Vector3)(0, 4, -20), @ZERO_QUATERNION, @physicsWorld)
      @vehicle.chassis.add(camera2)
      @scene.add @vehicle.chassis
      for wheel in @vehicle.wheels
        @scene.add wheel

    tick: (tpf) ->
      for box in @boxes
        box.tick(tpf)
      @vehicle.tick(tpf, @actions) if @vehicle?
      @physicsWorld.stepSimulation tpf, 10

    doMouseEvent: (event, raycaster) ->

    doKeyboardEvent: (e) ->
      if @keysActions[e.code]
        @actions[@keysActions[e.code]] = event.type == 'keydown'
        e.preventDefault()
        e.stopPropagation()

    setCamera: (id) ->
      switch id
        when 1
          engine.setCamera(camera)
        when 2
          engine.setCamera(camera2)

  gameScene = new GameScene()

  Engine3D.scenify(engine, ->
    engine.initScene(gameScene)
  )

  engine.start()
)
