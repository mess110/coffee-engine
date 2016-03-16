# A base class for holding meshes.
class BaseModel

  visible: true
  mesh: undefined

  # @param [Number] i the new scale
  setScale: (i) ->
    @mesh.scale.set i, i, i

  # Sets object visibility recursively.
  #
  # @param [Boolean] value
  setVisible: (value) ->
    @mesh.traverse (object) ->
      object.visible = value
    @visible = value

  # Toggles model wireframe
  toggleWireframe: ->
    return unless @mesh? or @mesh.material?
    @mesh.material.wireframe = !@mesh.material.wireframe
    if @mesh.material.materials?
      for material in @mesh.material.materials
        material.wireframe = !material.wireframe
    @mesh.material.wireframe

  # Checked weather the raycaster intersects the mesh
  #
  # @param [Raycaster] raycaster
  isHovered: (raycaster) ->
    raycaster.intersectObject(@mesh).length > 0

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
    # ms to stop the animation before the normal end period
    options.preStopMs ?= 50
    if options.reverse
      unless options.loop
        reverseLoopBug = true
      # options.loop = false
      options.timeScale *= -1

    anim = @animation(animationName)
    anim.stop() if anim.isPlaying
    # throw 'already playing' if anim.isPlaying
    anim.timeScale = options.timeScale
    anim.loop = options.loop
    if reverseLoopBug
      anim.loop = true
    anim.play()
    if reverseLoopBug
      setTimeout ->
        anim.stop()
      , anim.data.length * 1000 - options.preStopMs
    anim

  # checks if an animation is playing
  #
  # @param [String] animationName
  #
  # @see @animation(animationName)
  isPlaying: (animationName) ->
    @animation(animationName).isPlaying

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
      if animation.data.name == animationName
        return animation
    throw "#{animationName} not found"
