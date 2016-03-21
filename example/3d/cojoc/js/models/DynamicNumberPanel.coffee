class DynamicNumberPanel extends Panel
  constructor: (options = {})->
    options.width ?= 2
    options.height ?= 2
    options.textSpace ?= 256
    options.animateChange ?= true
    options.align ?= 'center'

    @dynamicTexture  = new THREEx.DynamicTexture(options.textSpace, options.textSpace)
    mat = new THREE.MeshBasicMaterial(map: @dynamicTexture.texture, transparent: true)
    mat.depthTest = false
    @mesh = Helper.plane(
      width: options.width,
      height: options.height,
      material: mat
    )
    @options = options
    @set(' ')

  clear: ->
    @dynamicTexture.clear()

  set: (text = '', init = false) ->
    if init
      @prev = undefined
      @original = undefined
      @text = undefined

    text = text.toString()
    @clear()

    if isNumeric(text)
      if @original?
        @prev = @text
      else
        @original = text
    @text = text

    color = 'white'
    if @prev? and @options.animateChange
      if parseFloat(@text) < parseFloat(@original)
        color = 'red'
      else if parseFloat(@text) > parseFloat(@original)
        color = '#00ff06'

      srcScale = 1
      destScale = 2
      duration = 1000
      model = @
      if parseFloat(@prev) < parseFloat(@text)
        @tween = new TWEEN.Tween({x: srcScale}).to({x: destScale}, duration)
          .easing(TWEEN.Easing.Circular.InOut)
        @tween.onUpdate( ->
          model.mesh.scale.set(@x, @x, @x)
        ).start()
        setTimeout =>
          @tween = new TWEEN.Tween({x: destScale}).to({x: srcScale}, duration)
            .easing(TWEEN.Easing.Circular.InOut)
          @tween.onUpdate( ->
            model.mesh.scale.set(@x, @x, @x)
          ).start()
        , 1000

    @dynamicTexture.drawTextCooked(
      text: text,
      fillStyle: color,
      align: @options.align,
      font: 'bold 140px Arial',
      lineHeight: 0.75,
      strokeStyle: 'black'
    )

    return
