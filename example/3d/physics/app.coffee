Ammo().then((Ammo) ->
  config = Config.get()

  # config.toggleDebug()
  # config.toggleStats()
  config.fillWindow()
  engine = new Engine3D()
  engine.renderer.setPixelRatio( window.devicePixelRatio )

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 )
  camera.position.x = -4.84
  camera.position.y = 4.39
  camera.position.z = -35.11
  camera.lookAt( new THREE.Vector3( 0.33, -0.40, 0.85 ) )
  engine.setCamera(camera)

  class GameScene extends BaseScene

    init: ->
      @DISABLE_DEACTIVATION = 4
      @TRANSFORM_AUX = new (Ammo.btTransform)
      @ZERO_QUATERNION = new (THREE.Quaternion)(0, 0, 0, 1)

      @actions = {}
      @keysActions =
        'KeyW': 'acceleration'
        'KeyS': 'braking'
        'KeyA': 'left'
        'KeyD': 'right'
      @syncList = []

      engine.setClearColor( 0xbfd1e5 )

      @initGraphics()
      @initPhysics()
      @createObjects()

    initPhysics: ->
      collisionConfiguration = new (Ammo.btDefaultCollisionConfiguration)
      dispatcher = new (Ammo.btCollisionDispatcher)(collisionConfiguration)
      broadphase = new (Ammo.btDbvtBroadphase)
      solver = new (Ammo.btSequentialImpulseConstraintSolver)
      @physicsWorld = new (Ammo.btDiscreteDynamicsWorld)(dispatcher, broadphase, solver, collisionConfiguration)
      @physicsWorld.setGravity new (Ammo.btVector3)(0, -9.82, 0)
      return

    initGraphics: ->
      ambientLight = new (THREE.AmbientLight)(0x404040)
      @scene.add ambientLight

      dirLight = new (THREE.DirectionalLight)(0xffffff, 1)
      dirLight.position.set 10, 10, 5
      @scene.add dirLight

      @materialDynamic = new (THREE.MeshPhongMaterial)(color: 0xfca400)
      @materialStatic = new (THREE.MeshPhongMaterial)(color: 0x999999)
      @materialInteractive = new (THREE.MeshPhongMaterial)(color: 0x990000)
      return

    createObjects: ->
      new Box(new (THREE.Vector3)(0, -0.5, 0), @ZERO_QUATERNION, 75, 1, 75, 0, 2, @)
      quaternion = new (THREE.Quaternion)(0, 0, 0, 1)
      quaternion.setFromAxisAngle new (THREE.Vector3)(1, 0, 0), -Math.PI / 18
      new Box(new (THREE.Vector3)(0, -1.5, 0), quaternion, 8, 4, 10, 0, undefined, @)
      size = .75
      nw = 8
      nh = 6
      j = 0
      while j < nw
        i = 0
        while i < nh
          new Box(new (THREE.Vector3)(size * j - (size * (nw - 1) / 2), size * i, 10), @ZERO_QUATERNION, size, size, size, 10, undefined, @)
          i++
        j++
      new Vehicle(new (THREE.Vector3)(0, 4, -20), @ZERO_QUATERNION, @)
      return

    tick: (tpf) ->
      i = 0
      while i < @syncList.length
        @syncList[i] tpf
        i++
      @physicsWorld.stepSimulation tpf, 10

    doMouseEvent: (event, raycaster) ->

    doKeyboardEvent: (e) ->
      if @keysActions[e.code]
        @actions[@keysActions[e.code]] = event.type == 'keydown'
        e.preventDefault()
        e.stopPropagation()

  gameScene = new GameScene()

  Engine3D.scenify(engine, ->
    engine.initScene(gameScene)
  )

  engine.start()
)
