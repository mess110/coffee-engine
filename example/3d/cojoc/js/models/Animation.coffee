class Animation

  inHero: (card, hero) ->
    Helper.tween(mesh: card.mesh, target: PosHelp.heroPresent(hero.ownerId), kind: 'Cubic', direction: 'In')
      .start()
    @coolSlide(card, hero)

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

  inDisplayed: (card, displayed) ->
    console.log displayed
