# https://github.com/kripken/ammo.js/blob/master/ammo.idl#L37
class Player extends BaseModel
  constructor: ->
    super()

    @massVehicle = 80

    @physicsWorld = Hodler.item('physicsWorld')

    @TRANSFORM_AUX = new (Ammo.btTransform)

    # @mesh = JsonModelManager.clone('dacia1310')
    # @mesh = Helper.plane()
    # @mesh = Helper.cube(mdaciaap: 'track00')
    @mesh = Helper.cube(color: 'green')

    pos = new (THREE.Vector3)(0, 10, -20)
    quat = new (THREE.Quaternion)(0, 0, 0, 1)

    @transform = new (Ammo.btTransform)
    @transform.setIdentity()
    @transform.setOrigin new (Ammo.btVector3)(pos.x, pos.y, pos.z)
    @transform.setRotation new (Ammo.btQuaternion)(quat.x, quat.y, quat.z, quat.w)

    motionState = new (Ammo.btDefaultMotionState)(@transform)
    @localInertia = new (Ammo.btVector3)(0, 0, 0)

    # geometry = new (Ammo.btCapsuleShape)(0.5, 0.5)
    geometry = new (Ammo.btCapsuleShapeZ)(0.5, 0.5)
    geometry.calculateLocalInertia @massVehicle, @localInertia
    @body = new (Ammo.btRigidBody)(new (Ammo.btRigidBodyConstructionInfo)(@massVehicle, motionState, geometry, @localInertia))
    @body.setActivationState Utils.PHYSICS.DISABLE_DEACTIVATION
    @body.setFriction 0
    @physicsWorld.addRigidBody @body

    @tbv30 = new Ammo.btVector3()
    @central = new Ammo.btVector3()
    @target = new (THREE.Vector3)(0, 0, 0)

  tick: (tpf, actions) ->
    # speed = @body.getCurrentSpeedKmHour()
    # console.log(speed)

    # if @asd
      # @tbv30.setValue(0, 0, 20)
      # @body.setLinearVelocity(@tbv30)
      # @body.setLinearVelocity(@tbv30)
      # @body.applyCentralImpulse(@tbv30)
      # @body.applyForce(@tbv30)
    if actions.right
      @target.x -= 100 * tpf
    else
      @target.x = 0

    # @transform.getOrigin().setX(@target.x)

    @tbv30.setValue(@target.x, @target.y, @target.z)

    # @body.setLinearVelocity(@tbv30)
    # @body.applyForce(@tbv30, @central)
    @body.applyCentralForce(@tbv30)
    # @body.applyCentralImpulse(@tbv30)
    # @body.setLinearVelocity(@tbv30)

    @moveToBody(@TRANSFORM_AUX)
