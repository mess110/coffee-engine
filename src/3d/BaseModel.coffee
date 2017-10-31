# A base class for holding meshes.
class BaseModel

  constructor: () ->
    @visible = false
    @mesh = undefined

  # @param [Number] i the new scale
  setScale: (i) ->
    @mesh.scale.set i, i, i

  # Set the opacitity of the mesh
  #
  # @param [Number] opacity
  setOpacity: (opacity) ->
    @mesh.material.opacity = opacity

  # Get the current opaicty of the mesh
  getOpacity: ->
    @mesh.material.opacity

  # Set the position of the mesh
  #
  # @param [Vector3] pos
  setPosition: (pos) ->
    @mesh.position.set pos.x, pos.y, pos.z

  # Sets object visibility recursively.
  #
  # @param [Boolean] value
  setVisible: (value) ->
    @mesh.traverse (object) ->
      object.visible = value
    @visible = value

  isVisible: ->
    @visible

  # attach a mesh to a bone
  #
  # @param [String] boneName
  # @param [Mesh] mesh
  #
  # between 71 and 72, for some reason there is always another bone
  # with the same name. That is why we keep track of added,
  # so we don't add it twice
  attachToBone: (boneName, mesh) ->
    added = false
    if @mesh instanceof THREE.SkinnedMesh
      @mesh.traverse (object) ->
        return if added
        if object instanceof THREE.Bone && object.name == boneName
          added = true
          object.add mesh

  # detach a mesh from a bone
  #
  # @param [String] boneName
  # @param [Mesh] mesh
  detachFromBone: (boneName, mesh) ->
    if @mesh instanceof THREE.SkinnedMesh
      @mesh.traverse (object) ->
        if object instanceof THREE.Bone && object.name == boneName
          object.remove mesh

  # Change the skin to a TextureManager texture
  #
  # @param [String] key
  setSkin: (key) ->
    tex = TextureManager.get().items[key]
    throw new Error('texture not loaded') unless tex?
    @mesh.material.materials[0].map = tex

  # Toggles model wireframe
  toggleWireframe: ->
    return unless @mesh?
    if @mesh.material?
      @mesh.material.wireframe = !@mesh.material.wireframe
      if @mesh.material.materials?
        for material in @mesh.material.materials
          material.wireframe = !material.wireframe
      @mesh.material.wireframe
    else
      return unless @mesh.children?
      for mesh in @mesh.children
        continue unless mesh.material?
        mesh.material.wireframe = !mesh.material.wireframe

  # Checked weather the raycaster intersects the mesh
  #
  # @param [Raycaster] raycaster
  isHovered: (raycaster) ->
    # raycaster.intersectObject(@mesh).length > 0 ||
    # raycaster.intersectObjects(@mesh.children).length > 0
    raycaster.intersectObject(@mesh, true).length > 0

  # Play an animation
  #
  # @param [String] animationName
  #
  # @see @animation(animationName)
  #
  # @example
  #   @model.animate(0)
  #   @model.animate('ArmatureAction')
  #   @model.animate(0, reverse: true)
  #   @model.animate(0, reverse: true, loop: false)
  animate: (animationName, options={}) ->
    options.loop ?= true
    options.reverse ?= false
    options.timeScale ?= 1
    options.name ?= animationName

    if options.reverse
      options.timeScale *= -1

    anim = @animation(options.name)
    anim.setEffectiveTimeScale(options.timeScale)

    if options.loop
      anim.clampWhenFinished = false
      anim.setLoop(THREE.LoopRepeat)
    else
      unless options.reverse
        anim.clampWhenFinished = true
        anim.setLoop(THREE.LoopOnce, 0)

    @stopAnimations()
    anim.play()

    if options.reverse && options.loop == false
      setTimeout ->
        anim.stop()
      , anim._clip.duration * 1000

    return anim

  # updates all animations
  updateAnimations: (tpf) ->
    if @mesh.animationsMixer?
      @mesh.animationsMixer.update(tpf)

  # stops all animations
  stopAnimations: ->
    for animation in @mesh.animations
      if animation.isRunning()
        animation.stop()

  # checks if an animation is playing
  #
  # @param [String] animationName
  #
  # @see @animation(animationName)
  isPlaying: (animationName) ->
    @animation(animationName).isRunning()

  # Find an animation by name or index
  #
  # @param [String] animationName/animationIndex
  animation: (animationName) ->
    unless @mesh instanceof THREE.SkinnedMesh
      throw '@mesh is not a THREE.SkinnedMesh'
    if isNumeric(animationName)
      animationIndex = parseInt(animationName)
      if animationIndex >= @mesh.animations.size()
        throw "Animation index #{animationIndex} out of bounds"
      return @mesh.animations[animationIndex]
    for animation in @mesh.animations
      if animation._clip.name == animationName
        return animation

    allAnimations = @mesh.animations.map (a) -> a.data.name
    throw "#{animationName} not found. Possible animations are: #{allAnimations}"

  # Gets the animation duration in seconds
  #
  # @param [String] animationName
  duration: (animationName) ->
    @animation(animationName)._clip.duration * 1000

  # Move the mesh to the body position according to ammo.js
  #
  # @example
  #
  #   @TRANSFORM_AUX = new (Ammo.btTransform)
  #
  #   tick: (tpf) ->
  #     @moveToBody(@TRANSFORM_AUX)
  moveToBody: (transformAux) ->
    ms = @body.getMotionState()
    if ms
      ms.getWorldTransform transformAux
      p = transformAux.getOrigin()
      q = transformAux.getRotation()
      @mesh.position.set p.x(), p.y(), p.z()
      @mesh.quaternion.set q.x(), q.y(), q.z(), q.w()
