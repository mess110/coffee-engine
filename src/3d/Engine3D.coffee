# The Engine - vrummm
class Engine3D
  @loadingSceneAssets = ["assets/scenes/start.save.json"]

  # Starting point of the engine
  constructor: () ->
    @uptime = 0
    @time = undefined
    @config = Config.get()
    @webgl = Detector.webgl

    @width = @config.width
    @height = @config.height
    @takeScreenshot = false

    renderer = if @webgl then THREE.WebGLRenderer else PolyfillRenderer
    @renderer = new renderer(
      antialias: @config.antialias
      alpha: @config.transparentBackground
      logarithmicDepthBuffer: @config.logarithmicDepthBuffer
    )
    # @renderer.context.disable(@renderer.context.DEPTH_TEST)
    @renderer.sortObjects = @config.sortObjects
    @renderer.setSize @width, @height
    @appendDom()
    @renderer.domElement.setAttribute('id', 'coffee-engine-dom')

    camera = Helper.camera(aspect: @width / @height, near: Utils.CAMERA_DEFAULT_NEAR, far: Utils.CAMERA_DEFAULT_FAR)
    @setCamera(camera)
    @camera.position.z = 10

    @anaglyphEffect = new THREE.AnaglyphEffect(@renderer)
    @anaglyphEffect.setSize(@width, @height)

    @stereoEffect = new THREE.StereoEffect(@renderer)
    @stereoEffect.setSize(@width, @height)

    @sceneManager = SceneManager.get()

    @renderer.domElement.addEventListener "mouseup", @mouseHandler, false
    @renderer.domElement.addEventListener "mousedown", @mouseHandler, false
    @renderer.domElement.addEventListener "mousemove", @mouseHandler, false

    document.addEventListener "keydown", @keyboardHandler, false
    document.addEventListener "keyup", @keyboardHandler, false

    @renderer.domElement.addEventListener "touchstart", @touchHandler, false
    @renderer.domElement.addEventListener "touchmove", @touchHandler, false
    @renderer.domElement.addEventListener "touchend", @touchHandler, false
    @renderer.domElement.addEventListener "touchcancel", @touchHandler, false

    if @config.contextMenuDisabled
      document.addEventListener "contextmenu", (e) ->
        e.preventDefault()
      , false

    StatsManager.toggle() if @config.showStatsOnLoad

  setWidthHeight: (width, height) ->
    @width = width
    @height = height
    @config.width = width
    @config.height = height
    @camera.aspect = @width / @height
    @camera.updateProjectionMatrix()
    @renderer.setSize @width, @height

  # Delegate touches to mouse events
  touchHandler: (event) ->
    touches = event.changedTouches
    first = touches[0]
    type = ''
    switch event.type
      when 'touchstart'
        type = 'mousedown'
      when 'touchmove'
        type = 'mousemove'
      when 'touchend'
        type = 'mouseup'
      else
        return
    # initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    #                screenX, screenY, clientX, clientY, ctrlKey, 
    #                altKey, shiftKey, metaKey, button, relatedTarget);
    simulatedEvent = document.createEvent('MouseEvent')
    simulatedEvent.initMouseEvent type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null
    first.target.dispatchEvent simulatedEvent
    event.preventDefault()
    return


  # @nodoc
  mouseHandler: (event) =>
    raycaster = @_parseMouseEvent(event)
    @sceneManager.currentScene().doMouseEvent(event, raycaster) if raycaster?

  # @nodoc
  keyboardHandler: (event) =>
    @sceneManager.currentScene().doKeyboardEvent(event)

  # Sets the engine camera
  #
  # @param [Camera] camera
  #
  # It also takes care of window resizing for this specific camera on the renderer
  # if Config.get().resize is true.
  setCamera: (camera) ->
    @camera = camera
    if @config.resize
      @winResize = new THREEx.WindowResize(@renderer, @camera)

  # Set the renderer clearColor
  #
  # @see http://threejs.org/docs/#Reference/Renderers/WebGLRenderer.setClearColor
  #
  # @example
  #   engine.setClearColor(0xFFFFFF)
  #   engine.setClearColor(0xFFFFFF, 0.5)
  setClearColor: (color, alpha) ->
    @renderer.setClearColor(color, alpha)

  # Adds and sets a scene
  #
  # param [Scene] scene
  addScene: (scene) ->
    @sceneManager.addScene scene
    if !@sceneManager.currentSceneIndex?
      @sceneManager.setScene scene

  # Used to switch betweens scenes with init and uninit
  initScene: (scene, options = {}, fade=true) ->
    if fade
      Helper.fade(type: 'in')
      setTimeout =>
        @_doInitScene(scene, options)
        Helper.fade(type: 'out')
      , Utils.FADE_DEFAULT_DURATION
    else
      @_doInitScene(scene, options)

  # @nodoc
  _doInitScene: (scene, options) ->
    currentScene = @sceneManager.currentScene()
    if currentScene?
      currentScene.uninit()
    unless @sceneManager.hasScene(scene)
      @sceneManager.addScene(scene)

    scene.init(options)
    @sceneManager.setScene(scene)

  # Remove a scene
  #
  # param [Scene]
  removeScene: (scene) ->
    @sceneManager.removeScene scene

  render: =>
    console.warn 'engine.render() is deprecated. Use engine.start() instead.'
    @start()

  # Starts rendering
  #
  # Using requestAnimationFrame, this method will continously call itself. Think of
  # it like: "Ok, the scenes are configured, the game engine is ready, GO!"
  #
  # It updates:
  #
  # * the time per frame (tpf)
  # * uptime
  # * ticking the scene
  # * updating animations
  # * updating stats
  # * updating tweens
  # * rendering the scene
  start: =>
    return if @stop
    @frameId = requestAnimationFrame @start

    @width = window.innerWidth
    @height = window.innerHeight

    now = new Date().getTime()
    tpf = (now - (@time or now)) / 1000
    @time = now
    @uptime += tpf
    @sceneManager.tick(tpf)
    StatsManager.update(@_getActiveRenderer())
    TWEEN.update()

    if @composer?
      @renderer.clear()
      @composer.render(tpf)
    else
      @_getActiveRenderer().render @sceneManager.currentScene().scene, @camera
    @_takeScreenshot()
    VideoRecorderManager.capture(@renderer.domElement)

  enableComposer: (composer) ->
    @renderer.autoClear = false
    @composer = composer

  disableComposer: ->
    @renderer.autoClear = true
    @composer = undefined

  _getActiveRenderer: ->
    if @config.anaglyph
      @anaglyphEffect
    else if @config.stereoVR
      @stereoEffect
    else
      @renderer

  # queue taking a screenshot.
  # the screenshot is taken right after the render method is called
  screenshot: ->
    @takeScreenshot = true

  # return an image string of the last screenshot
  getScreenshot: (withMeta=false)->
    throw 'use engine.screenshot() first' unless @screenshotData?
    if withMeta
      @screenshotData
    else
      data = @screenshotData
      data.split(',')[1]

  _takeScreenshot: ->
    return unless @takeScreenshot
    @takeScreenshot = false
    @screenshotData = @_getActiveRenderer().domElement.toDataURL()

  # pause/stop the render method
  #
  # @see @resume
  pause: ->
    cancelAnimationFrame @frameId
    @frameId = undefined
    @stop = true

  # Resumes rendering
  #
  # @example
  #
  # document.addEventListener("visibilitychange", (event) ->
  #   if document.hidden
  #     engine.pause()
  #   else
  #     engine.resume()
  # , false)
  resume: ->
    @stop = false
    @render()

  implode: =>
    @stop = true
    @removeDom()

  # Create a Raycaster from camera and x,y coordinates
  unproject: (x, y) ->
    mouseX = (x / @width) * 2 - 1
    mouseY = -(y / @height) * 2 + 1
    vector = new THREE.Vector3(mouseX, mouseY, 0.5)
    vector.unproject @camera
    return new THREE.Raycaster(@camera.position, vector.sub(@camera.position).normalize())

  removeDom: ->
    return if @renderer.domElement.parentNode == null
    try
      document.body.removeChild @renderer.domElement
    catch e
      console.log e

  appendDom: ->
    document.body.appendChild @renderer.domElement

  # @nodoc
  _parseMouseEvent: (event) ->
    event.preventDefault() if @config.preventDefaultMouseEvents
    return unless event.target is @renderer.domElement

    # could need event.clientX or event.clientY
    mouseX = (event.layerX / @width) * 2 - 1
    mouseY = -(event.layerY / @height) * 2 + 1
    vector = new THREE.Vector3(mouseX, mouseY, 0.5)
    vector.unproject @camera
    return new THREE.Raycaster(@camera.position, vector.sub(@camera.position).normalize())

  # @nodoc
  @scenify: (zeEngine, callback = -> {}) ->
    loadingScene = new LoadingScene(Engine3D.loadingSceneAssets, ->
      loadingScene.hasFinishedLoading = ->
        scene = CinematicScene.fromSaveObjectKey('start')
        zeEngine.addScene(scene)
        zeEngine.sceneManager.setScene(scene)
        callback()
      assets = CinematicScene.getAssets('start')
      loadingScene.loadAssets(assets)
    )
    zeEngine.addScene(loadingScene)
    loadingScene

  currentScene: ->
    @sceneManager.currentScene()

# TODO: move this outside because it is not a hack
THREE.Object3D::clear = ->
  children = @children
  i = children.length - 1
  while i >= 0
    child = children[i]
    child.clear()
    @remove child
    i--
  return
