# The engine renders scenes which extend this class.
#
# It keeps track of time, loaded state and facilitates
# user input.
#
# Common use cases include having a LoadingScene,
# MenuScene, GameScene etc.
#
# The engine can switch between these scenes.
class BaseScene
  scene: new THREE.Scene()
  jmm: JsonModelManager.get()
  lastMousePosition: undefined
  keyboard: new THREEx.KeyboardState()
  loaded: false
  uptime: 0

  # @nodoc
  fullTick: (tpf) ->
    @uptime += tpf
    @tick(tpf)

  # Used to init the scene
  init: ->
    throw 'scene.init not implemented'

  # used to uninit the scene
  uninit: ->
    @clear()

  # remove all the objects from the scene
  clear: ->
    children = @scene.children
    i = @scene.children.length - 1
    while i >= 0
      child = children[i]
      child.clear()
      @scene.remove child
      i--
    return

  # This method is automatically called by the engine for
  # each frame
  #
  # @param [Number] tpf time per frame
  tick: (tpf) ->
    throw 'scene.tick not implemented'

  # This method is automatically called by the engine when a
  # mouse event occurs. The corresponding raycaster is also given.
  #
  # @param [Event] event
  # @param [Raycaster] raycaster
  #
  # @see https://developer.mozilla.org/en/docs/Web/API/MouseEvent
  doMouseEvent: (event, raycaster) ->
    throw 'scene.doMouseEvent not implemented'

  # This method is automatically called by the engine when a
  # keyboard event occurs
  #
  # @param [Event] event
  #
  # @see https://developer.mozilla.org/en/docs/Web/API/KeyboardEvent
  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'

  # Makes the camera look at an object with a tweening motion by
  # changing the camera rotation
  #
  # @example
  #
  #   @scene.tweenLookAt(mesh, camera)
  #
  tweenLookAt: (object, camera, duration = 1000, easing = TWEEN.Easing.Cubic.InOut) ->
    startRotation = camera.rotation.clone()
    camera.lookAt object.position
    endRotation = camera.rotation.clone()
    camera.rotation.set startRotation.x, startRotation.y, startRotation.z

    tween = new (TWEEN.Tween)(startRotation).to(endRotation, duration).onUpdate(->
      camera.rotation.set @x, @y, @z
      return
    ).easing(easing).start()

  # Moves the camera at an object's position with a tweening motion
  #
  # @example
  #
  #   @scene.tweenMoveTo(mesh, camera)
  #
  tweenMoveTo: (object, camera, duration = 1000, easing = TWEEN.Easing.Cubic.InOut) ->
    startPosition = camera.position.clone()
    endPosition = object.position.clone()

    tween = new (TWEEN.Tween)(camera.position).to(endPosition, duration).onUpdate(->
      camera.position.set @x, @y, @z
      return
    ).easing(easing).start()
