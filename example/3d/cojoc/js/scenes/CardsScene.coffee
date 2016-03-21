class CardsScene extends BaseScene
  tm: TextureManager.get()

  init: ->
    engine.camera.position.set 0, 0, 15
    engine.camera.lookAt(Helper.zero.clone())

    @tween = undefined

    @cameraTarget = Helper.cube()
    @cameraTarget.visible = false
    @scene.add @cameraTarget

    @cards = []
    @hammertime = new Hammer(document.body)
    @hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
    @hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL })

    @hammertime.on 'pan', (ev) ->
      dirMult = if ev.direction == 2 then 1 else -1
      cardsScene.cameraTarget.position.x += ev.distance / 1000 * dirMult
      return

    @hammertime.on 'swipe', (ev) ->
      dirMult = if ev.direction == 2 then 1 else -1

      target = cardsScene.cameraTarget.position.clone()
      target.x += ev.distance / 10 * dirMult

      if cardsScene.tween?
        cardsScene.tween.stop()

      cardsScene.tween = new TWEEN.Tween(cardsScene.cameraTarget.position).to(target, 250).onUpdate(->
        cardsScene.cameraTarget.position.set @x, @y, @z
      ).easing(TWEEN.Easing.Cubic.Out)
      cardsScene.tween.start()
      return

    @plane = Helper.intersectPlane()

    j = 10
    while j > 0
      j -= 1
      for card in constants.cards
        @card = new Card()
        @card.switchTo(card)
        @card.mesh.position.x += (@card.w + 1) * @cards.size()
        @card.mesh.position.y = 1
        @scene.add @card.mesh
        @cards.push @card

    # @cards.first().selected = true

  uninit: ->
    super()
    @hammertime.destroy()
    @tween.stop() if @tween?

  tick: (tpf) ->
    dist = Math.sqrt(Math.pow((engine.camera.position.x - @cameraTarget.position.x), 2))
    dirMod = 0
    if engine.camera.position.x < @cameraTarget.position.x
      dirMod = 1
    else if engine.camera.position.x > @cameraTarget.position.x
      dirMod = -1
    engine.camera.position.x += 5 * tpf * (dist / 2) * dirMod

  doMouseEvent: (event, raycaster) ->
    if event.type == 'mousedown'
      @tween.stop() if @tween?

    for card in @cards
      isHovered = card.isHovered(raycaster)

      if card.selected
        pos = raycaster.ray.intersectPlane(@plane)
        pos.z = 0
        card.setPosition(pos)

      if event.type == "mousemove"
        card.glow(isHovered, 'blue')
    return

  doKeyboardEvent: (event) ->
    # if event.type == 'keydown'
      # @cards[0].moveTo()
