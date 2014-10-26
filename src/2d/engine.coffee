class Engine
  constructor: (canvasId, width, height, tick, doMouseDown, doKeyDown) ->
    @time = undefined
    @width = width
    @height = height
    @backgroundColor = '#FFFFFF'
    @canvasId = canvasId
    @canvas = document.getElementById(@canvasId)
    addEventListener("keydown", doKeyDown, false);
    addEventListener("keyup", doKeyDown, false);
    @canvas.addEventListener("mousedown", @getPosition, false);
    @canvas.addEventListener("mouseup", @getPosition, false);

    @canvas.setAttribute('tabindex','0');
    @canvas.width = width
    @canvas.height = height
    @context = @canvas.getContext("2d");
    @tick = tick
    @doMouseDown = doMouseDown

  getPosition: (event) ->
    x = new Number()
    y = new Number()
    if event.x isnt `undefined` and event.y isnt `undefined`
      x = event.x
      y = event.y
    # Firefox method to get the position
    else
      x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
    x -= @.offsetLeft
    y -= @.offsetTop

    event.position = new Point(x, y)
    doMouseDown event
    return

  getHexData: (x, y, w, h) ->
    p = @context.getImageData(x, y, w, h).data;
    "#" + ("000000" + Utils.rgbToHex(p[0], p[1], p[2])).slice(-6);

  clear: ->
    @context.fillStyle = @backgroundColor
    @context.fillRect 0, 0, @width, @height

  drawText: (text) ->
    @context.fillStyle = "blue"
    @context.font = "bold 16px Arial"
    @context.fillText text, 10, 30

  draw: ->
    requestAnimationFrame Engine::draw
    now = new Date().getTime()
    tpf = (now - (@time or now)) / 1000
    @time = now
    @tick tpf

  start: ->
    @draw()
