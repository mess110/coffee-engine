class Box extends BaseModel
  constructor: (pos, quat, w, l, h, mass, friction, gameScene) ->
    super()

    @gameScene = gameScene

    material = if mass > 0 then @gameScene.materialDynamic else @gameScene.materialStatic
    shape = new (THREE.BoxGeometry)(w, l, h, 1, 1, 1)
    geometry = new (Ammo.btBoxShape)(new (Ammo.btVector3)(w * 0.5, l * 0.5, h * 0.5))

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
    @gameScene.scene.add mesh
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
    @gameScene.physicsWorld.addRigidBody body
    if mass > 0
      body.setActivationState @gameScene.DISABLE_DEACTIVATION
      @gameScene.syncList.push sync
    return
