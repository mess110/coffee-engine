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

  vehicleSteering = undefined

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


    tick: (tpf) ->
      i = 0
      while i < @syncList.length
        @syncList[i] tpf
        i++
      @physicsWorld.stepSimulation tpf, 10

    doMouseEvent: (event, raycaster) ->

    doKeyboardEvent: (event) ->
      if event.type == 'keyup'
        @keyup(event)
      else
        @keydown(event)

    keyup: (e) ->
      if @keysActions[e.code]
        @actions[@keysActions[e.code]] = false
        e.preventDefault()
        e.stopPropagation()
        return false
      return

    keydown: (e) ->
      if @keysActions[e.code]
        @actions[@keysActions[e.code]] = true
        e.preventDefault()
        e.stopPropagation()
        return false
      return

    createWheelMesh: (radius, width) ->
      t = new (THREE.CylinderGeometry)(radius, radius, width, 24, 1)
      t.rotateZ Math.PI / 2
      mesh = new (THREE.Mesh)(t, @materialInteractive)
      mesh.add new (THREE.Mesh)(new (THREE.BoxGeometry)(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), @materialInteractive)
      @scene.add mesh
      mesh

    createChassisMesh: (w, l, h) ->
      shape = new (THREE.BoxGeometry)(w, l, h, 1, 1, 1)
      mesh = new (THREE.Mesh)(shape, @materialInteractive)
      @scene.add mesh
      mesh


    createBox: (pos, quat, w, l, h, mass, friction) ->
      material = if mass > 0 then @materialDynamic else @materialStatic
      shape = new (THREE.BoxGeometry)(w, l, h, 1, 1, 1)
      geometry = new (Ammo.btBoxShape)(new (Ammo.btVector3)(w * 0.5, l * 0.5, h * 0.5))
      # Sync physics and graphics

      sync = (dt) ->
        ms = body.getMotionState()
        if ms
          ms.getWorldTransform gameScene.TRANSFORM_AUX
          p = gameScene.TRANSFORM_AUX.getOrigin()
          q = gameScene.TRANSFORM_AUX.getRotation()
          mesh.position.set p.x(), p.y(), p.z()
          mesh.quaternion.set q.x(), q.y(), q.z(), q.w()
        return

      if !mass
        mass = 0
      if !friction
        friction = 1
      mesh = new (THREE.Mesh)(shape, material)
      mesh.position.copy pos
      mesh.quaternion.copy quat
      @scene.add mesh
      transform = new (Ammo.btTransform)
      transform.setIdentity()
      transform.setOrigin new (Ammo.btVector3)(pos.x, pos.y, pos.z)
      transform.setRotation new (Ammo.btQuaternion)(quat.x, quat.y, quat.z, quat.w)
      motionState = new (Ammo.btDefaultMotionState)(transform)
      localInertia = new (Ammo.btVector3)(0, 0, 0)
      geometry.calculateLocalInertia mass, localInertia
      rbInfo = new (Ammo.btRigidBodyConstructionInfo)(mass, motionState, geometry, localInertia)
      body = new (Ammo.btRigidBody)(rbInfo)
      body.setFriction friction
      #body.setRestitution(.9);
      #body.setDamping(0.2, 0.2);
      @physicsWorld.addRigidBody body
      if mass > 0
        body.setActivationState @DISABLE_DEACTIVATION
        @syncList.push sync
      return

    createVehicle: (pos, quat) ->
      # Vehicle contants
      chassisWidth = 1.8
      chassisHeight = .6
      chassisLength = 4
      massVehicle = 800
      wheelAxisPositionBack = -1
      wheelRadiusBack = .4
      wheelWidthBack = .3
      wheelHalfTrackBack = 1
      wheelAxisHeightBack = .3
      wheelAxisFrontPosition = 1.7
      wheelHalfTrackFront = 1
      wheelAxisHeightFront = .3
      wheelRadiusFront = .35
      wheelWidthFront = .2
      friction = 1000
      suspensionStiffness = 20.0
      suspensionDamping = 2.3
      suspensionCompression = 4.4
      suspensionRestLength = 0.6
      rollInfluence = 0.2
      steeringIncrement = .04
      steeringClamp = .5
      maxEngineForce = 2000
      maxBreakingForce = 100
      # Chassis
      geometry = new (Ammo.btBoxShape)(new (Ammo.btVector3)(chassisWidth * .5, chassisHeight * .5, chassisLength * .5))
      transform = new (Ammo.btTransform)

      addWheel = (isFront, pos, radius, width, index) ->
        wheelInfo = vehicle.addWheel(pos, wheelDirectionCS0, wheelAxleCS, suspensionRestLength, radius, tuning, isFront)
        wheelInfo.set_m_suspensionStiffness suspensionStiffness
        wheelInfo.set_m_wheelsDampingRelaxation suspensionDamping
        wheelInfo.set_m_wheelsDampingCompression suspensionCompression
        wheelInfo.set_m_frictionSlip friction
        wheelInfo.set_m_rollInfluence rollInfluence
        wheelMeshes[index] = gameScene.createWheelMesh(radius, width)
        return

      # Sync keybord actions and physics and graphics

      sync = (dt) ->
        speed = vehicle.getCurrentSpeedKmHour()
        # speedometer.innerHTML = (if speed < 0 then '(R) ' else '') + Math.abs(speed).toFixed(1) + ' km/h'
        breakingForce = 0
        engineForce = 0
        if gameScene.actions.acceleration
          if speed < -1
            breakingForce = maxBreakingForce
          else
            engineForce = maxEngineForce
        if gameScene.actions.braking
          if speed > 1
            breakingForce = maxBreakingForce
          else
            engineForce = -maxEngineForce / 2
        if gameScene.actions.left
          if vehicleSteering < steeringClamp
            vehicleSteering += steeringIncrement
        else
          if gameScene.actions.right
            if vehicleSteering > -steeringClamp
              vehicleSteering -= steeringIncrement
          else
            if vehicleSteering < -steeringIncrement
              vehicleSteering += steeringIncrement
            else
              if vehicleSteering > steeringIncrement
                vehicleSteering -= steeringIncrement
              else
                vehicleSteering = 0
        vehicle.applyEngineForce engineForce, BACK_LEFT
        vehicle.applyEngineForce engineForce, BACK_RIGHT
        vehicle.setBrake breakingForce / 2, FRONT_LEFT
        vehicle.setBrake breakingForce / 2, FRONT_RIGHT
        vehicle.setBrake breakingForce, BACK_LEFT
        vehicle.setBrake breakingForce, BACK_RIGHT
        vehicle.setSteeringValue vehicleSteering, FRONT_LEFT
        vehicle.setSteeringValue vehicleSteering, FRONT_RIGHT
        tm = undefined
        p = undefined
        q = undefined
        i = undefined
        n = vehicle.getNumWheels()
        i = 0
        while i < n
          vehicle.updateWheelTransform i, true
          tm = vehicle.getWheelTransformWS(i)
          p = tm.getOrigin()
          q = tm.getRotation()
          wheelMeshes[i].position.set p.x(), p.y(), p.z()
          wheelMeshes[i].quaternion.set q.x(), q.y(), q.z(), q.w()
          i++
        tm = vehicle.getChassisWorldTransform()
        p = tm.getOrigin()
        q = tm.getRotation()
        chassisMesh.position.set p.x(), p.y(), p.z()
        chassisMesh.quaternion.set q.x(), q.y(), q.z(), q.w()
        return

      transform.setIdentity()
      transform.setOrigin new (Ammo.btVector3)(pos.x, pos.y, pos.z)
      transform.setRotation new (Ammo.btQuaternion)(quat.x, quat.y, quat.z, quat.w)
      motionState = new (Ammo.btDefaultMotionState)(transform)
      localInertia = new (Ammo.btVector3)(0, 0, 0)
      geometry.calculateLocalInertia massVehicle, localInertia
      body = new (Ammo.btRigidBody)(new (Ammo.btRigidBodyConstructionInfo)(massVehicle, motionState, geometry, localInertia))
      body.setActivationState gameScene.DISABLE_DEACTIVATION
      gameScene.physicsWorld.addRigidBody body
      chassisMesh = gameScene.createChassisMesh(chassisWidth, chassisHeight, chassisLength)
      # Raycast Vehicle
      engineForce = 0
      vehicleSteering = 0
      breakingForce = 0
      tuning = new (Ammo.btVehicleTuning)
      rayCaster = new (Ammo.btDefaultVehicleRaycaster)(gameScene.physicsWorld)
      vehicle = new (Ammo.btRaycastVehicle)(tuning, body, rayCaster)
      vehicle.setCoordinateSystem 0, 1, 2
      gameScene.physicsWorld.addAction vehicle
      # Wheels
      FRONT_LEFT = 0
      FRONT_RIGHT = 1
      BACK_LEFT = 2
      BACK_RIGHT = 3
      wheelMeshes = []
      wheelDirectionCS0 = new (Ammo.btVector3)(0, -1, 0)
      wheelAxleCS = new (Ammo.btVector3)(-1, 0, 0)
      addWheel true, new (Ammo.btVector3)(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT
      addWheel true, new (Ammo.btVector3)(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT
      addWheel false, new (Ammo.btVector3)(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT
      addWheel false, new (Ammo.btVector3)(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT
      @syncList.push sync
      return

    createObjects: ->
      @createBox new (THREE.Vector3)(0, -0.5, 0), @ZERO_QUATERNION, 75, 1, 75, 0, 2
      quaternion = new (THREE.Quaternion)(0, 0, 0, 1)
      quaternion.setFromAxisAngle new (THREE.Vector3)(1, 0, 0), -Math.PI / 18
      @createBox new (THREE.Vector3)(0, -1.5, 0), quaternion, 8, 4, 10, 0
      size = .75
      nw = 8
      nh = 6
      j = 0
      while j < nw
        i = 0
        while i < nh
          @createBox new (THREE.Vector3)(size * j - (size * (nw - 1) / 2), size * i, 10), @ZERO_QUATERNION, size, size, size, 10
          i++
        j++
      @createVehicle new (THREE.Vector3)(0, 4, -20), @ZERO_QUATERNION
      return

  gameScene = new GameScene()

  Engine3D.scenify(engine, ->
    engine.initScene(gameScene)
  )

  engine.start()
)
