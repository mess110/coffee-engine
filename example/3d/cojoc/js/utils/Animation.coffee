class Animation

  inHero: (card, hero) ->
    Helper.tween(mesh: card.mesh, target: PosHelp.heroPresent(hero.ownerId), kind: 'Cubic', direction: 'In')
      .start()
    @coolSlide(card, hero)
    4000

  coolSlide: (card, hero) ->
    setTimeout =>
      Helper.tween(duration: 2000, mesh: card.mesh, target: PosHelp.heroPresent2(hero.ownerId), kind: 'Cubic', direction: 'Out')
        .start()
      @inHeroPosition(card, hero)
    , 1000

  inHeroPosition: (card, hero) ->
    setTimeout =>
      Helper.tween(mesh: card.mesh, target: PosHelp.hero(hero.ownerId), kind: 'Quartic', direction: 'Out')
        .start()
    , 2000

  inDisplayed: (card, displayed, startDelay, i, total) ->
    duration = 250
    setTimeout =>
      target = PosHelp.displayed(displayed.ownerId, (card.w + 0.5) * i)
      target.x -= (total - 1) * (card.w + 0.5) / 2
      card.moveTo(target, duration, 'Cubic', 'Out')
    , startDelay
    startDelay +  duration

  inHeld: (card, displayed, startDelay, i, total) ->
    duration = 250
    setTimeout =>
      target = PosHelp.held(displayed.ownerId, (card.w / 4 * 3) * i)
      target.x -= (total - 1) * (card.w / 4 * 3) / 2
      card.moveTo(target, duration, 'Cubic', 'Out')
    , startDelay
    startDelay +  duration

  inPreview: (card) ->
    # card.mesh.position.z = 16
    card.mesh.position.y = -4

  inDiscard: (card, discarded, startDelay) ->
    duration = 500
    setTimeout =>
      target = { x: -20, y: 2, z: 10, rX: 0, rY: Math.PI, rZ: Math.PI / 2 }
      card.moveTo(target, duration, 'Quadratic', 'Out')
    , startDelay
    startDelay +  duration
