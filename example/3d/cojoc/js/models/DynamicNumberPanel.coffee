class DynamicNumberPanel extends Panel
  constructor: ->
    @dynamicTexture  = new THREEx.DynamicTexture(256,256)
    mat = new THREE.MeshBasicMaterial(map: @dynamicTexture.texture, transparent: true)
    mat.depthTest = false
    @mesh = Helper.plane(width: 2, height: 2, wSegments: 32, hSegments: 32, material: mat)
    @set(' ')

  clear: ->
    @dynamicTexture.clear()

  set: (text) ->
    text = text.toString()
    @clear()

    if isNumeric(text)
      if @original?
        @prev = @text
      else
        @original = text
    @text = text

    color = 'white'
    if @prev?
      console.log @original
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
      align: 'center',
      font: 'bold 140px Arial',
      lineHeight: 0.75,
      strokeStyle: 'black'
    )

    return
