class BaseScene
  scene: new THREE.Scene()
  lastMousePosition: undefined
  keyboard: new THREEx.KeyboardState()
  loaded: false
  uptime: 0

  fullTick: (tpf) ->
    @uptime += tpf
    @tick(tpf)

  tick: (tpf) ->
    throw 'scene.tick not implemented'

  doMouseEvent: (event, raycaster) ->
    throw 'scene.doMouseEvent not implemented'

  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'

  tweenLookAt: (object, camera, duration = 1000, easing = TWEEN.Easing.Cubic.InOut) ->
    startRotation = camera.rotation.clone()
    camera.lookAt object.position
    endRotation = camera.rotation.clone()
    camera.rotation.set startRotation.x, startRotation.y, startRotation.z

    tween = new (TWEEN.Tween)(startRotation).to(endRotation, duration).onUpdate(->
      camera.rotation.set @x, @y, @z
      return
    ).easing(easing).start()

  tweenMoveTo: (object, camera, duration = 1000, easing = TWEEN.Easing.Cubic.InOut) ->
    startPosition = camera.position.clone()
    endPosition = object.position.clone()

    tween = new (TWEEN.Tween)(camera.position).to(endPosition, duration).onUpdate(->
      camera.position.set @x, @y, @z
      return
    ).easing(easing).start()
