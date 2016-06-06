# Used to overlay stuff on a canvas. The canvas can be later used to create
# a material.
#
# @see Helper.materialFromCanvas
#
# @example
#   @drawImage(key: 'corb')
#   @drawImage(key: 'template')
#
#   @drawText(text: 'foo', y: 60, strokeStyle: 'black')
#   @drawBezier(
#     curve: '99.2,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
#     text: 'hello world'
#     strokeStyle: 'black'
#     letterPadding: 4
#   )
class ArtGenerator
  tm: TextureManager.get()

  # @nodoc
  constructor: (options) ->
    @options = options

    @canvas = document.createElement( 'canvas' )
    @canvas.width = options.width
    @canvas.height = options.height
    @ctx = @canvas.getContext( '2d' )

  # @example
  #   @art = new ArtGenerator(
  #     width: 340
  #     height: 473
  #   )
  #   @art.fromJson items: [
  #     {
  #       type: 'image'
  #       key: 'corb'
  #     }
  #     {
  #       type: 'image'
  #       key: 'template'
  #     }
  #     {
  #       type: 'text'
  #       text: 'foo'
  #       y: 60
  #       strokeStyle: 'black'
  #     }
  #     {
  #       type: 'bezier'
  #       curve: '99.2,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
  #       text: 'hello world'
  #       strokeStyle: 'black'
  #       letterPadding: 4
  #     }
  #   ]
  fromJson: (json) ->
    @clear()
    for item in json.items
      if item.asset? && item.asset.key?
        item.key = item.asset.key
      if item.type == 'image'
        @drawImage(item)
      if item.type == 'text'
        @drawText(item)
      if item.type == 'bezier'
        @drawBezier(item)

  # Used to overlay a bezier curve on a canvas
  #
  # @see StackOverflow.drawBezier
  # @see draw bezier tool
  #
  # @example
  #   @drawBezier(
  #     curve: '99.2,207.2,130.02,60.0,300.5,276.2,300.7,176.2'
  #     text: 'hello world'
  #     strokeStyle: 'black'
  #     letterPadding: 4
  #   )
  drawBezier: (options) ->
    StackOverflow.drawBezier(options, @ctx)

  # Overlay text on a canvas
  #
  # @example
  #   @drawText(text: 'foo', y: 60, strokeStyle: 'black')
  drawText: (options = {}) ->
    throw 'options.text missing' unless options.text?
    options.fillStyle ?= 'white'
    options.fillLineWidth ?= 1
    options.strokeLineWidth ?= 7
    options.strokeStyle ?= undefined # lol
    options.font ?= '40px Helvetica'
    options.x ?= 0
    options.y ?= 0

    @ctx.save()
    @ctx.font = options.font

    if options.strokeStyle?
      @ctx.miterLimit = 2
      @ctx.lineJoin = 'circle'
      @ctx.strokeStyle = options.strokeStyle
      @ctx.lineWidth = options.strokeLineWidth
      @ctx.strokeText options.text, options.x, options.y

    @ctx.lineWidth = options.fillLineWidth
    @ctx.fillStyle = options.fillStyle
    @ctx.fillText options.text, options.x, options.y
    @ctx.restore()

  # Used to overlay an image on the canvas
  #
  # @example
  #   @drawImage(key: 'corb')
  #   @drawImage(key: 'template')
  #
  drawImage: (options = {}) ->
    throw 'key not found' unless options.key?
    options.x ?= 0
    options.y ?= 0
    options.angle ?= 0

    x = options.x
    y = options.y

    image = @tm.items[options.key].image

    if options.angle != 0
      @ctx.save()
      @ctx.translate(options.x + image.width / 2, options.y + image.height / 2)
      @ctx.rotate(options.angle * Math.PI / 180)
      x = -(image.width / 2)
      y = -(image.height / 2)

    @ctx.drawImage(image, x, y)

    if options.angle != 0
      @ctx.restore()

  # clear the canvas context
  clear: ->
    @ctx.clearRect(0, 0, @options.width, @options.height)
