class ManaCrystal extends Panel
  constructor: ->
    super(key: 'mana', width: 1, height: 1)
    @setOpacity(0.0)

  shake: () ->
    callback = =>
      new NoticeMeModifier(@, 1, 0.5, 500)
    setTimeout(callback, 0)
    setTimeout(callback, 500)

  fadeTo: (to) ->
    new FadeModifier(@, @mesh.material.opacity, to, 500)

class ManaBar extends BaseModel
  constructor: (options = {}) ->
    super()
    @cubes = []

    options.reverse ?= false

    @mesh = new THREE.Object3D()

    wM = 1
    w = constants.max_mana * wM
    @box = new THREE.Mesh( new THREE.BoxGeometry( w, 1, 0.1 ),
      new THREE.MeshNormalMaterial(transparent: true, opacity: 0.0) )
    @box.renderOrder = 0
    @box.position.x = (w / 2) - (wM / 2)
    @box.position.z = -0.1
    @mesh.add @box

    @maxMana = 0
    @currentMana = 0

    @text = new DynamicNumberPanel(textSpace: 512, align: if options.reverse then 'right' else 'left')
    @text.mesh.position.set (if options.reverse then -0.35 else 0.35), -0.3, 0
    @mesh.add @text.mesh

    for i in [0...constants.max_mana] by 1
      cube = new ManaCrystal()
      cube.renderOrder = 1
      cube.mesh.position.x = if options.reverse then i * wM * -1 else i * wM

      @cubes.push cube
      @mesh.add cube.mesh

  update: (currentMana, maxMana) ->
    return if maxMana == @maxMana and currentMana == @currentMana

    @maxMana = maxMana
    @maxMana = constants.max_mana if @maxMana > constants.max_mana
    @currentMana = currentMana
    @currentMana = @maxMana if @currentMana > @maxMana

    if @maxMana > 0
      @text.set(@toString())

    for i in [0...constants.max_mana] by 1
      cube = @cubes[i]
      if i < @maxMana
        if i < @currentMana
          cube.fadeTo(1)
        else
          cube.fadeTo(0.5)
      else
        cube.fadeTo(0)
    return

  shake: ->
    for cube in @cubes
      cube.shake()
    return

  toString: ->
    "#{@currentMana} / #{@maxMana}"
