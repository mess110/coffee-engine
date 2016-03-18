# The Engine - vrummm
class Engine3D
  time: undefined
  uptime: 0
  config: Config.get()

  # Starting point of the engine
  constructor: () ->
    @width = @config.width
    @height = @config.height

    @renderer = new THREE.WebGLRenderer(
      antialias: @config.antialias
      alpha: @config.transparentBackground
      logarithmicDepthBuffer: false
    )
    # @renderer.context.disable(@renderer.context.DEPTH_TEST)
    @renderer.sortObjects = config.sortObjects
    @renderer.setSize @width, @height
    document.body.appendChild @renderer.domElement

    camera = Helper.camera(aspect: @width / @height, near: 0.5, far: 1000000)
    @setCamera(camera)
    @camera.position.z = 10

    @anaglyphEffect = new THREE.AnaglyphEffect(@renderer)
    @anaglyphEffect.setSize(@width, @height)

    @sceneManager = SceneManager.get()

    document.addEventListener "mouseup", @onDocumentMouseEvent, false
    document.addEventListener "mousedown", @onDocumentMouseEvent, false
    document.addEventListener "mousemove", @onDocumentMouseEvent, false
    document.addEventListener "keydown", @onDocumentKeyboardEvent, false
    document.addEventListener "keyup", @onDocumentKeyboardEvent, false

    if @config.contextMenuDisabled
      document.addEventListener "contextmenu", (e) ->
        e.preventDefault()
      , false

    @statsManager = StatsManager.get()
    @statsManager.toggle() if @config.showStatsOnLoad

  # @nodoc
  onDocumentMouseEvent: (event) =>
      raycaster = @_parseMouseEvent(event)
      @sceneManager.currentScene().doMouseEvent(event, raycaster) if raycaster?

  # @nodoc
  onDocumentKeyboardEvent: (event) =>
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

  # Remove a scene
  #
  # param [Scene]
  removeScene: (scene) ->
    @sceneManager.removeScene scene

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
  render: =>
    requestAnimationFrame this.render

    @width = window.innerWidth
    @height = window.innerHeight

    now = new Date().getTime()
    tpf = (now - (@time or now)) / 1000
    @time = now
    @uptime += tpf
    @sceneManager.tick(tpf)
    THREE.AnimationHandler.update(tpf) if @config.animate
    @statsManager.update(@renderer)
    TWEEN.update()
    @renderer.render @sceneManager.currentScene().scene, @camera

    if @config.anaglyph
      @anaglyphEffect.render @sceneManager.currentScene().scene, @camera

  # @nodoc
  _parseMouseEvent: (event) ->
    event.preventDefault() if @config.preventDefaultMouseEvents
    if event.target is @renderer.domElement
      # could need event.clientX or event.clientY
      mouseX = (event.layerX / @width) * 2 - 1
      mouseY = -(event.layerY / @height) * 2 + 1
      vector = new THREE.Vector3(mouseX, mouseY, 0.5)
      vector.unproject @camera
      return new THREE.Raycaster(@camera.position, vector.sub(@camera.position).normalize())
