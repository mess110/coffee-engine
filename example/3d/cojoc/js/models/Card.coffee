class Card extends CojocModel
  w: 6.4
  h: 8.9
  canvasWidth: 335
  canvasHeight: 452
  wSegments: 12
  hSegments: 12
  selected: false

  constructor: (json={}) ->
    options =
      width: @w, height: @h
      wSegments: @wSegments, hSegments: @hSegments

    # because we don't want to modify the constants object
    json = JSON.parse(JSON.stringify(json))
    json.back ?= 'cardBack'

    @mesh = new THREE.Object3D()

    Glow.addAll(@, options)

    @back = new Panel(
      key: json.back,
      class: 'PlaneGeometry',
      class: 'PlaneBufferGeometry',
      width: @w, height: @h,
      wSegments: @wSegments, hSegments: @hSegments
    )
    @back.mesh.renderOrder = renderOrder.get()
    @back.mesh.rotation.y = Math.PI
    @mesh.add @back.mesh

    @art = new ArtGenerator(width: @canvasWidth, height: @canvasHeight)
    # @art.fromJson @fromTemplate(json)
    # mat2 = Helper.materialFromCanvas(@art.canvas)
    # mat2.map.minFilter = THREE.LinearFilter

    @front = new Panel(
      key: json.back,
      class: 'PlaneGeometry',
      class: 'PlaneBufferGeometry',
      width: @w, height: @h,
      wSegments: @wSegments, hSegments: @hSegments
    )
    @front.mesh.renderOrder = renderOrder.get()
    @mesh.add @front.mesh

    @health = new DynamicNumberPanel()
    @health.mesh.renderOrder = renderOrder.get()
    @mesh.add @health.mesh

    @attack = new DynamicNumberPanel()
    @attack.mesh.renderOrder = renderOrder.get()
    @mesh.add @attack.mesh

    @cost = new DynamicNumberPanel()
    @cost.mesh.renderOrder = renderOrder.get()
    @mesh.add @cost.mesh

    # @switchTo(json)

  fromTemplate: (json) ->
    a = []
    for item in json.art.picture
      a.push item
    # a = json.art.front
    for item in constants.ArtTemplates[json.type]
      a.push item
    for item in json.art.front
      a.push item
    items: a

  switchTo: (json) ->
    @art.fromJson @fromTemplate(json)
    mat2 = Helper.materialFromCanvas(@art.canvas)
    mat2.map.minFilter = THREE.LinearFilter
    @front.mesh.material = mat2

    @health.set json.health, true
    @attack.set json.attack, true
    @cost.set json.cost, true

    if json.type == constants.CardType.hero
      @health.mesh.position.set 2.6, 3.4, 0
      @health.mesh.rotation.z = -Math.PI / 2
    else
      @health.mesh.position.set 2.6, -3.4, 0

    @attack.mesh.position.set -2.6, -3.4, 0
    @cost.mesh.position.set -2.6, 4.1, 0
    @

  moveTo: (target, duration, kind = 'Cubic', direction = 'In') ->
    @clearMoveToTween()
    me = @
    from = @mesh.position.clone()
    from.rX = @mesh.rotation.x
    from.rY = @mesh.rotation.y
    from.rZ = @mesh.rotation.z

    distance = Helper.distanceTo(@mesh.position, target)
    @tween = new TWEEN.Tween(from).to(target, duration).onUpdate(->
      me.mesh.position.set @x, @y, @z
      me.mesh.rotation.set @rX, @rY, @rZ
      return
    ).easing(TWEEN.Easing[kind][direction]).start().onComplete(->
      me.tween = null
    )

  clearMoveToTween: ->
    if @tween?
      @tween.stop()

  tweenBend: ->
    me = @
    x = 0
    @tween = new TWEEN.Tween(amount: x).to(amount: 0.9, 1000).onUpdate(->
      me.bend(amount: @amount)
      return
    ).easing(TWEEN.Easing.Linear.None).start().onComplete(->
      me.tween = null
    )

  dissolve: ->
    return if @dissolveEffect?
    duration = 1
    color = 'orange'
    nt = TextureManager.get().items['noise']
    @dissolveEffect = new DissolvingEffect(@front.mesh, color, duration, true, nt)
    @dissolveEffect2 = new DissolvingEffect(@back.mesh, color, duration, true, nt)
    for item in [@cost, @attack, @health]
      new FadeModifier(item, 1, 0, duration * 100)
    return

  bend: (options = {})->
    options.amount ?= 0.9
    options.side ?= 'top'
    options.dirMod ?= 1
    i = 0
    while i < @back.geometry.vertices.length / 2
      amount = options.amount ** (i / 10)

      index = 2 * i
      index2 = 2 * i + 1

      if options.side == 'bottom'
        index = @back.geometry.vertices.length - index
        index2 = @back.geometry.vertices.length - index2

      if @front.geometry.vertices[index]?
        @front.geometry.vertices[index].z = amount * -1 * options.dirMod
      if @front.geometry.vertices[index2]?
        @front.geometry.vertices[index2].z = amount * -1 * options.dirMod

      if @back.geometry.vertices[index]?
        @back.geometry.vertices[index].z = amount * options.dirMod
      if @back.geometry.vertices[index2]?
        @back.geometry.vertices[index2].z = amount * options.dirMod

      if @glowGreen.mesh.geometry.vertices[index]?
        @glowGreen.mesh.geometry.vertices[index].z = amount * -1 * options.dirMod
      if @glowGreen.mesh.geometry.vertices[index2]?
        @glowGreen.mesh.geometry.vertices[index2].z = amount * -1 * options.dirMod
      i++
    @back.geometry.verticesNeedUpdate = true
    @front.geometry.verticesNeedUpdate = true
    @glowGreen.mesh.geometry.verticesNeedUpdate = true
    return

  bringToFront: ->
    for elem in [@glowGreen, @glowBlue, @glowRed, @glowYellow, @back, @front, @health, @attack, @cost]
      if elem.mesh?
        elem.mesh.renderOrder = renderOrder.get()
      else
        elem.renderOrder = renderOrder.get()