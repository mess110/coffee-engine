class Vehicle extends BaseModel
  constructor: (pos, quat, gameScene) ->
    super()

    @gameScene = gameScene
    that = @

    vehicleSteering = undefined

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
      wheelMeshes[index] = that.createWheelMesh(radius, width)
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
    chassisMesh = @createChassisMesh(chassisWidth, chassisHeight, chassisLength)
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
    @gameScene.syncList.push sync
    return

  createWheelMesh: (radius, width) ->
    t = new (THREE.CylinderGeometry)(radius, radius, width, 24, 1)
    t.rotateZ Math.PI / 2
    mesh = new (THREE.Mesh)(t, @gameScene.materialInteractive)
    mesh.add new (THREE.Mesh)(new (THREE.BoxGeometry)(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), @gameScene.materialInteractive)
    @gameScene.scene.add mesh
    mesh

  createChassisMesh: (w, l, h) ->
    shape = new (THREE.BoxGeometry)(w, l, h, 1, 1, 1)
    mesh = new (THREE.Mesh)(shape, @gameScene.materialInteractive)
    @gameScene.scene.add mesh
    mesh

  tick: (tpf) ->
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
