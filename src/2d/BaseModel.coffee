# @nodoc
class BaseModel
  constructor: (options) ->
    options.position ||= {}

    @loaded = false
    @position =
      x: options.position.x || 0
      y: options.position.y || 0

    unless options.url?
      throw 'missing url'

    @image = new Image
    @image.src = options.url
    @image.onload = =>
      @width = @image.width
      @height = @image.height
      @loaded = true

  render: (context) ->
    return unless @loaded
    context.drawImage(@image, @position.x, @position.y, @width, @height)
