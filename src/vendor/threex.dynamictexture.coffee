THREEx = THREEx or {}
#////////////////////////////////////////////////////////////////////////////////
#		Constructor							//
#////////////////////////////////////////////////////////////////////////////////

###*
# create a dynamic texture with a underlying canvas
#
# @param {Number} width  width of the canvas
# @param {Number} height height of the canvas
###

THREEx.DynamicTexture = (width, height) ->
  canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  @canvas = canvas
  context = canvas.getContext('2d')
  @context = context
  texture = new (THREE.Texture)(canvas)
  @texture = texture
  return

#////////////////////////////////////////////////////////////////////////////////
#		methods								//
#////////////////////////////////////////////////////////////////////////////////

###*
# clear the canvas
#
# @param  {String*} fillStyle 		the fillStyle to clear with, if not provided, fallback on .clearRect
# @return {THREEx.DynamicTexture}      the object itself, for chained texture
###

THREEx.DynamicTexture::clear = (fillStyle) ->
  # depends on fillStyle
  if fillStyle != undefined
    @context.fillStyle = fillStyle
    @context.fillRect 0, 0, @canvas.width, @canvas.height
  else
    @context.clearRect 0, 0, @canvas.width, @canvas.height
  # make the texture as .needsUpdate
  @texture.needsUpdate = true
  # for chained API
  this

###*
# draw text
#
# @param  {String}		text	- the text to display
# @param  {Number|undefined}	x	- if provided, it is the x where to draw, if not, the text is centered
# @param  {Number}		y	- the y where to draw the text
# @param  {String*} 		fillStyle - the fillStyle to clear with, if not provided, fallback on .clearRect
# @param  {String*} 		contextFont - the font to use
# @return {THREEx.DynamicTexture}	- the object itself, for chained texture
###

THREEx.DynamicTexture::drawText = (text, x, y, fillStyle, contextFont) ->
  # set font if needed
  if contextFont != undefined
    @context.font = contextFont
  # if x isnt provided
  if x == undefined or x == null
    textSize = @context.measureText(text)
    x = (@canvas.width - (textSize.width)) / 2
  # actually draw the text
  @context.fillStyle = fillStyle
  @context.fillText text, x, y
  # make the texture as .needsUpdate
  @texture.needsUpdate = true
  # for chained API
  this

THREEx.DynamicTexture::drawTextCooked = (options) ->
  context = @context
  canvas = @canvas

  computeMaxTextLength = (text) ->
    `var x`
    `var x`
    maxText = ''
    maxWidth = (1 - (params.margin * 2)) * canvas.width
    while maxText.length != text.length
      textSize = context.measureText(maxText)
      if textSize.width > maxWidth
        break
      maxText += text.substr(maxText.length, 1)
    maxText

  options = options or {}
  text = options.text
  params =
    margin: if options.margin != undefined then options.margin else 0.1
    lineHeight: if options.lineHeight != undefined then options.lineHeight else 0.1
    align: if options.align != undefined then options.align else 'left'
    fillStyle: if options.fillStyle != undefined then options.fillStyle else 'black'
    fillLineWidth: if options.fillLineWidth? then options.fillLineWidth else 1
    strokeLineWidth: if options.strokeLineWidth? then options.strokeLineWidth else 20
    font: if options.font != undefined then options.font else 'bold ' + 0.2 * 512 + 'px Arial'
    strokeStyle: undefined
  # sanity check
  console.assert typeof text == 'string'
  context.save()
  context.fillStyle = params.fillStyle
  if options.strokeStyle?
    context.miterLimit = 2
    context.lineJoin = 'circle'
    context.strokeStyle = options.strokeStyle
  context.font = params.font
  y = (params.lineHeight + params.margin) * canvas.height
  while text.length > 0
    # compute the text for specifically this line
    maxText = computeMaxTextLength(text)
    # update the remaining text
    text = text.substr(maxText.length)
    # compute x based on params.align
    textSize = context.measureText(maxText)
    if params.align == 'left'
      x = params.margin * canvas.width
    else if params.align == 'right'
      x = (1 - (params.margin)) * canvas.width - (textSize.width)
    else if params.align == 'center'
      x = (canvas.width - (textSize.width)) / 2
    else
      console.assert false
    # actually draw the text at the proper position
    if options.strokeStyle?
      @context.lineWidth = params.strokeLineWidth
      @context.strokeText maxText, x, y
    @context.lineWidth = params.fillLineWidth
    @context.fillText maxText, x, y
    # goto the next line
    y += params.lineHeight * canvas.height
  context.restore()
  # make the texture as .needsUpdate
  @texture.needsUpdate = true
  # for chained API
  this

###*
# execute the drawImage on the internal context
# the arguments are the same the official context2d.drawImage
###

THREEx.DynamicTexture::drawImage = ->
  # call the drawImage
  @context.drawImage.apply @context, arguments
  # make the texture as .needsUpdate
  @texture.needsUpdate = true
  # for chained API
  this
