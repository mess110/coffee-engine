class BaseText extends BaseModel

  constructor: (options={}) ->
    super()

    @canvasW = options.canvasW || 500
    @canvasH = options.canvasH || 500

    @w = options.w || 4
    @h = options.h || 4

    @margin = options.margin
    @lineHeight = options.lineHeight
    @align = options.align
    @font = options.font
    @fillStyle = options.fillStyle
    @fillLineWidth = options.fillLineWidth
    @strokeStyle = options.strokeStyle
    @strokeLineWidth = options.strokeLineWidth
    @text = options.text
    @x = options.x
    @y = options.y

    @dynamicTexture  = new THREEx.DynamicTexture(@canvasW, @canvasH)
    @setText(@text)

    geom = new THREE.PlaneGeometry(@w, @h)
    material  = new THREE.MeshBasicMaterial({
      map : @dynamicTexture.texture
      transparent: true
    })

    @mesh = new THREE.Mesh(geom, material)

  setText: (text) ->
    text = ' ' if text == '' || !text?

    @text = text.toString()
    @clear()
    @dynamicTexture.drawTextCooked(
      text: @text
      margin: @margin
      lineHeight: @lineHeight
      align: @align
      fillStyle: @fillStyle
      fillLineWidth: @fillLineWidth
      strokeStyle: @strokeStyle
      strokeLineWidth: @strokeLineWidth
      x: @x
      y: @y
      font: @font
    )

  clear: ->
    @dynamicTexture.clear()

  getTextWidth: (s) ->
    @dynamicTexture.context.measureText(s).width
