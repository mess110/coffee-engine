Ammo().then((Ammo) ->
  config = Config.get()
  # config.toggleDebug()
  # config.toggleStats()
  config.fillWindow()

  engine = new Engine3D()
  Hodler.add('engine', engine)

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 )
  camera.position.x = -4.84
  camera.position.y = 4.39
  camera.position.z = -35.11
  camera.lookAt( new THREE.Vector3( 0.33, -0.40, 0.85 ) )
  engine.setCamera(camera)
  Hodler.add('camera', camera)

  camera2 = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 )
  camera2.position.set(0, 3, -7)
  camera2.lookAt(Helper.zero)
  Hodler.add('camera2', camera2)

  menuScene = new MenuScene()
  Hodler.add('menuScene', menuScene)
  gameScene = new GameScene()
  Hodler.add('gameScene', gameScene)

  Engine3D.scenify(engine, ->
    engine.initScene(menuScene)
  )

  engine.start()
)
