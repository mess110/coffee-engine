class Engine3D
  constructor: () ->
    @config = Config.get()

    @width = @config.width
    @height = @config.height
    @time = undefined

    @renderer = new THREE.WebGLRenderer({antialias: @config.antialias})
    @renderer.setSize @width, @height
    @renderer.setClearColor(0xc2ba9d, 1)
    document.body.appendChild @renderer.domElement

    camera = new THREE.PerspectiveCamera(75, @width / @height, 0.1, 1000)
    @setCamera(camera)
    @camera.position.z = 10

    # TODO find out if anaglyph not supported - what happens?
    @anaglyphEffect = new THREE.AnaglyphEffect(@renderer)
    @anaglyphEffect.setSize(@width, @height)
    @anaglyphEffect.setDistanceBetweenGlyphs(@config.anaglyphDistance)

    @projector = new THREE.Projector()
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

  onDocumentMouseEvent: (event) =>
      raycaster = @_parseMouseEvent(event)
      @sceneManager.currentScene().doMouseEvent(event, raycaster) if raycaster?

  onDocumentKeyboardEvent: (event) =>
      @sceneManager.currentScene().doKeyboardEvent(event)

  setCursor: (url) ->
    document.body.style.cursor = "url('#{url}'), auto"

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
    @statsManager.update(@renderer)
    TWEEN.update()
    @renderer.render @sceneManager.currentScene().scene, @camera

    if @config.anaglyph
      @anaglyphEffect.render @sceneManager.currentScene().scene, @camera

  _parseMouseEvent: (event) ->
    event.preventDefault() if @config.preventDefaultMouseEvents
    if event.target is @renderer.domElement
      # could need event.clientX or event.clientY
      mouseX = (event.layerX / @width) * 2 - 1
      mouseY = -(event.layerY / @height) * 2 + 1
      vector = new THREE.Vector3(mouseX, mouseY, 0.5)
      @projector.unprojectVector vector, @camera
      return new THREE.Raycaster(@camera.position, vector.sub(@camera.position).normalize())
