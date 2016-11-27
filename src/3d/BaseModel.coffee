# A base class for holding meshes.
class BaseModel

  visible: true
  mesh: undefined

  # @param [Number] i the new scale
  setScale: (i) ->
    @mesh.scale.set i, i, i

  # Set the opacitity of the mesh
  #
  # @param [Number] opacity
  setOpacity: (opacity) ->
    @mesh.material.opacity = opacity

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
    raycaster.intersectObject(@mesh).length > 0 ||
    raycaster.intersectObjects(@mesh.children).length > 0

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

    # ms to stop the animation before the normal end period
    options.preStopMs ?= 50
    if options.reverse
      unless options.loop
        reverseLoopBug = true
      # options.loop = false
      options.timeScale *= -1

    @stopAnimations()
    anim = @animation(options.name)
    anim.weight = 1

    anim.timeScale = options.timeScale
    unless options.loop
      setTimeout =>
        anim.weight = 0
      , anim.clip.duration * 1000

  updateAnimations: (tpf) ->
    if @mesh.animationsMixer?
      @mesh.animationsMixer.update(tpf)

  # stops all animations
  stopAnimations: ->
    for animation in @mesh.animations
      animation.weight = 0

  # checks if an animation is playing
  #
  # @param [String] animationName
  #
  # @see @animation(animationName)
  isPlaying: (animationName) ->
    @animation(animationName).weight == 1

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
      if animation.clip.name == animationName
        return animation

    allAnimations = @mesh.animations.map (a) -> a.data.name
    throw "#{animationName} not found. Possible animations are: #{allAnimations}"

