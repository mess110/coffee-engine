# The 2D Engine. Vrum Wrum..
class Engine2D

  # @nodoc
  constructor: (canvasId, width, height, windowResize = false) ->
    @sceneManager = SceneManager.get()

    @time = undefined
    @width = width
    @height = height
    @backgroundColor = '#FFFFFF'
    @canvasId = canvasId

    document.addEventListener "mousedown", @onDocumentMouseEvent, false
    document.addEventListener "mouseup", @onDocumentMouseEvent, false
    document.addEventListener "mousemove", @onDocumentMouseEvent, false
    document.addEventListener "keydown", @onDocumentKeyboardEvent, false
    document.addEventListener "keyup", @onDocumentKeyboardEvent, false

    @canvas = document.getElementById(@canvasId)
    @canvas.width = width
    @canvas.height = height
    @context = @canvas.getContext("2d");

    if windowResize
      window.addEventListener 'resize', @resize, false
      @resize()

  # @nodoc
  resize: ->
    canvasRatio = @canvas.height / @canvas.width
    windowRatio = window.innerHeight / window.innerWidth
    width = undefined
    height = undefined
    if windowRatio < canvasRatio
      height = window.innerHeight
      width = height / canvasRatio
    else
      width = window.innerWidth
      height = width * canvasRatio
    @canvas.style.width = width + 'px'
    @canvas.style.height = height + 'px'

  # @nodoc
  onDocumentMouseEvent: (event) =>
      @sceneManager.currentScene().doMouseEvent(event)

  # @nodoc
  onDocumentKeyboardEvent: (event) =>
      @sceneManager.currentScene().doKeyboardEvent(event)

  # TODO move this in BaseScene
  # @nodoc
  clear: ->
    @context.fillStyle = @backgroundColor
    @context.fillRect 0, 0, @width, @height

  # @nodoc
  render: =>
    requestAnimationFrame this.render

    now = new Date().getTime()
    tpf = (now - (@time or now)) / 1000
    @time = now

    @sceneManager.tick(tpf)

  #getPosition: (event) ->
    #x = new Number()
    #y = new Number()
    #if event.x isnt `undefined` and event.y isnt `undefined`
      #x = event.x
      #y = event.y
    ## Firefox method to get the position
    #else
      #x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      #y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
    #x -= @.offsetLeft
    #y -= @.offsetTop

    #event.position = new Point(x, y)
    #doMouseDown event
    #return
