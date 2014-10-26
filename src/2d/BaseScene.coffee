class BaseScene
  constructor: (engine) ->
    @engine = engine
    @context = @engine.context

  tick: (tpf) ->
    throw 'scene.tick not implemented'

  doMouseEvent: (event) ->
    throw 'scene.doMouseEvent not implemented'

  doKeyboardEvent: (event) ->
    throw 'scene.doKeyboardEvent not implemented'

  drawText: (text) ->
    @context.fillStyle = "blue"
    @context.font = "bold 16px Arial"
    @context.fillText text, 10, 30

  getHexData: (x, y, w, h) ->
    p = @context.getImageData(x, y, w, h).data;
    "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);
