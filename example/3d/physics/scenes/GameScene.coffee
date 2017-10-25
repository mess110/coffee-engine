class GameScene extends BaseScene

  init: (options) ->
    @ZERO_QUATERNION = new (THREE.Quaternion)(0, 0, 0, 1)

    @setCamera(2)

    @actions = {}
    @keysActions =
      'KeyW': 'acceleration'
      'KeyS': 'braking'
      'KeyA': 'left'
      'KeyD': 'right'
    @boxes = []

    Hodler.item('engine').setClearColor( 0xbfd1e5 )

    Helper.orbitControls(Hodler.item('engine'))

    @initGraphics()
    @physicsWorld = Helper.physicsWorld()
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
    @vehicle.chassis.add(Hodler.item('camera2'))
    @scene.add @vehicle.chassis
    for wheel in @vehicle.wheels
      @scene.add wheel

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

    console.log(e.code)
    if e.type == 'keydown'
      if (e.code == 'Digit1')
        @setCamera(1)
      if (e.code == 'Digit2')
        @setCamera(2)

  setCamera: (id) ->
    switch id
      when 1
        Hodler.item('engine').setCamera(Hodler.item('camera'))
      when 2
        Hodler.item('engine').setCamera(Hodler.item('camera2'))
