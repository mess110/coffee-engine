# The 3d Engine
class Engine3D
  constructor: () ->
    @config = Config.get()

    @width = @config.width
    @height = @config.height
    @time = undefined

    @renderer = new THREE.WebGLRenderer(
      antialias: @config.antialias
      alpha: @config.transparentBackground
    )
    @renderer.setSize @width, @height
    document.body.appendChild @renderer.domElement

    camera = new THREE.PerspectiveCamera(75, @width / @height, 0.1, 1000)
    @setCamera(camera)
    @camera.position.z = 10

    # TODO find out if anaglyph not supported - what happens?
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

  setCamera: (camera) ->
    @camera = camera
    if @config.resize
      @winResize = new THREEx.WindowResize(@renderer, @camera)

  addScene: (scene) ->
    @sceneManager.addScene scene
    if !@sceneManager.currentSceneIndex?
      @sceneManager.setScene scene

  removeScene: (scene) ->
    @sceneManager.removeScene scene

  render: =>
    requestAnimationFrame this.render

    @width = window.innerWidth
    @height = window.innerHeight

    now = new Date().getTime()
    tpf = (now - (@time or now)) / 1000
    @time = now
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
