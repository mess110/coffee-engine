# @nodoc
class BaseScene
  constructor: (engine) ->
    @engine = engine
    @context = @engine.context
    @loaded = false
    @uptime = 0

  # @nodoc
  fullTick: (tpf) ->
    @uptime += tpf
    @tick(tpf)

  # This method is automatically called by the engine for
  # each frame
  #
  # @param [Number] tpf time per frame
  tick: (tpf) ->
    throw 'scene.tick not implemented'

  # This method is automatically called by the engine when a
  # mouse event occurs.
  #
  # @param [Event] event
  #
  # @see https://developer.mozilla.org/en/docs/Web/API/MouseEvent
  doMouseEvent: (event) ->
    throw 'scene.doMouseEvent not implemented'

  # This method is automatically called by the engine when a
  # keyboard event occurs
  #
  # @param [Event] event
  #
  # @see https://developer.mozilla.org/en/docs/Web/API/KeyboardEvent
  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'

  drawText: (text) ->
    @context.fillStyle = "blue"
    @context.font = "bold 16px Arial"
    @context.fillText text, 10, 30

  getHexData: (x, y, w, h) ->
    p = @context.getImageData(x, y, w, h).data;
    "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);
