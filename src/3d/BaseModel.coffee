class BaseModel
  constructor: ->
    @mesh = undefined
    @visible = true

  setRotation: (x, y, z) ->
    @mesh.rotation.x = x
    @mesh.rotation.y = y
    @mesh.rotation.z = z

  setPosition: (x, y, z) ->
    if y?
      @mesh.position.x = x
      @mesh.position.y = y
      @mesh.position.z = z
    else
      @mesh.position.x = if x['x']? then x['x'] else 0
      @mesh.position.y = if x['y']? then x['y'] else 0
      @mesh.position.z = if x['z']? then x['z'] else 0
      @mesh.rotation.x = if x['rX']? then x['rX'] else 0
      @mesh.rotation.y = if x['rY']? then x['rY'] else 0
      @mesh.rotation.z = if x['rZ']? then x['rZ'] else 0

  getTweenFromPosition: () ->
    {
      x: @mesh.position.x
      y: @mesh.position.y
      z: @mesh.position.z
      rX: @mesh.rotation.x
      rY: @mesh.rotation.y
      rZ: @mesh.rotation.z
    }

  setPositionX: (x) ->
    @mesh.position.x = x

  setPositionY: (y) ->
    @mesh.position.y = y

  setPositionZ: (z) ->
    @mesh.position.z = z

  modifyPosition: (x, y, z) ->
    @mesh.position.x += x
    @mesh.position.y += y
    @mesh.position.z += z

  setScale: (i) ->
    @mesh.scale.set i, i, i

  setVisible: (b) ->
    @mesh.traverse (object) ->
      object.visible = b
    @visible = b

  isPressed: (raycaster) ->
    raycaster.intersectObject(@mesh).length > 0

  isHovered: (raycaster) ->
    raycaster.intersectObject(@mesh).length > 0

  attachParticle: (particle) ->
    if @mesh?
      @particle = particle
      @particle.attached = true
      @mesh.add particle.mesh

  detachParticle: ->
    if @mesh? and @particle?
      @mesh.remove @particle.mesh
      @particle.attached = false
      @particle = undefined
