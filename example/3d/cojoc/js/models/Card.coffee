class Card extends BaseModel
  w: 6.4
  h: 8.9
  canvasWidth: 335
  canvasHeight: 452
  wSegments: 32
  hSegments: 48
  selected: false

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

  constructor: (json) ->
    throw new Exception('need json when creating a card') unless json?
    # because we don't want to modify the constants object
    json = JSON.parse(JSON.stringify(json))
    json.back ?= 'cardBack'

    @mesh = new THREE.Object3D()

    @glow = new Panel(
      key: 'glowGreen'
      class: 'PlaneGeometry',
      class: 'PlaneBufferGeometry',
      width: @w, height: @h,
      wSegments: @wSegments, hSegments: @hSegments
    )
    @glow.mesh.material.depthTest = false
    @glow.setVisible(false)
    @glow.setScale(1.1)
    @mesh.add @glow.mesh

    @back = new Panel(
      key: json.back,
      class: 'PlaneGeometry',
      class: 'PlaneBufferGeometry',
      width: @w, height: @h,
      wSegments: @wSegments, hSegments: @hSegments
    ).mesh
    @back.rotation.y = Math.PI
    @mesh.add @back

    @art = new ArtGenerator(width: @canvasWidth, height: @canvasHeight)
    @art.fromJson @fromTemplate(json)
    mat2 = Helper.materialFromCanvas(@art.canvas)
    mat2.map.minFilter = THREE.LinearFilter

    @front = Helper.plane(
      class: 'PlaneGeometry',
      class: 'PlaneBufferGeometry',
      width: @w, height: @h,
      wSegments: @wSegments, hSegments: @hSegments,
      material: mat2)
    @front.renderOrder = renderOrder
    renderOrder += 1
    @mesh.add @front

    @health = new DynamicNumberPanel()
    @health.mesh.position.set 2.6, -3.4, 0
    if json.type == constants.CardType.hero
      @health.mesh.position.set 2.6, 3.4, 0
      @health.mesh.rotation.z = -Math.PI / 2
    @health.mesh.renderOrder = renderOrder
    renderOrder += 1
    @health.set json.health if json.health
    @mesh.add @health.mesh

    @attack = new DynamicNumberPanel()
    @attack.mesh.position.set -2.6, -3.4, 0
    @attack.mesh.renderOrder = renderOrder
    renderOrder += 1
    @attack.set json.attack if json.attack
    @mesh.add @attack.mesh

    @cost = new DynamicNumberPanel()
    @cost.mesh.position.set -2.6, 4.1, 0
    @cost.mesh.renderOrder = renderOrder
    renderOrder += 1
    @cost.set json.cost if json.cost
    @mesh.add @cost.mesh

    renderOrder += 100

  moveTo: ->
    if @tween?
      @tween.stop()
    me = @
    target = {x: 0, y: 10, z: 0}
    distance = Helper.distanceTo(@mesh.position, target)
    @tween = new TWEEN.Tween(@mesh.position).to(target, distance * 100).onUpdate(->
      me.mesh.position.set @x, @y, @z
      return
    ).easing(TWEEN.Easing.Linear.None).start().onComplete(->
      me.tween = null
    )

  tweenBend: ->
    me = @
    x = 0
    @tween = new TWEEN.Tween(amount: x).to(amount: 0.9, 1000).onUpdate(->
      me.bend(amount: @amount)
      return
    ).easing(TWEEN.Easing.Linear.None).start().onComplete(->
      me.tween = null
    )

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

      if @glow.mesh.geometry.vertices[index]?
        @glow.mesh.geometry.vertices[index].z = amount * -1 * options.dirMod
      if @glow.mesh.geometry.vertices[index2]?
        @glow.mesh.geometry.vertices[index2].z = amount * -1 * options.dirMod
      i++
    @back.geometry.verticesNeedUpdate = true
    @front.geometry.verticesNeedUpdate = true
    @glow.mesh.geometry.verticesNeedUpdate = true
    return
