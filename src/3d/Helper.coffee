# Helpers to get you started.
#
# Contains useful things like Helper.zero and Helper.one which are quite
# commonly used vectors in 3d programming. Just remember to clone them :)
#
# @see http://threejs.org/docs/#Reference/Math/Vector3
# @see http://blog.romanliutikov.com/post/58322336872/setup-scene-in-threejs
#
# @example
#   @scene.fog = Helper.fog(far: 70, color: 'white')
#   @scene.add Helper.grid(size: 200, step: 10, color: 'gray')
#   engine.setClearColor( @scene.fog.color, 1)
#
class Helper

  @zero: new THREE.Vector3(0, 0, 0)
  @one: new THREE.Vector3(1, 1, 1)
  @up: new THREE.Vector3(0, 1, 0)
  @down: new THREE.Vector3(0, -1, 0)

  @toggleFullScreen = Utils.toggleFullScreen
  @guid: Utils.guid
  @setCursor: Utils.setCursor
  @rgbToHex: Utils.rgbToHex

  @defaultTweenDuration = 1000

  @toVector3: (json) ->
    new (THREE.Vector3)(json.x, json.y, json.z)

  # Use JSON to clone an object
  @shallowClone: (json) ->
    JSON.parse(JSON.stringify(json))

  # Get a random number smaller than n
  @random: (n) ->
    Math.floor(Math.random() * n)

  # Calculate the distance between 2 vectors
  @distanceTo: (v1, v2) ->
    dx = v1.x - (v2.x)
    dy = v1.y - (v2.y)
    dz = v1.z - (v2.z)
    Math.sqrt dx * dx + dy * dy + dz * dz

  # Create a new camera.
  #
  # By default, it creates a PerspectiveCamera
  #
  # @param [Object] options for the camera
  #
  # @example
  #
  #   cam = Utils.camera()
  #
  #   cam = Utils.camera(view_angle: 45, aspect: config.width / config.height, 1, 1000)
  #
  #   cam = Utils.camera(type: 'Ortographic', view_angle: 45, aspect: config.width / config.height, 1, 1000)
  #
  # @see Config
  # @see Engine3D.setCamera
  @camera: (options={}) ->
    config = Config.get()
    options.view_angle = Utils.CAMERA_DEFAULT_VIEW_ANGLE unless options.view_angle?
    options.aspect = config.width / config.height unless options.aspect?
    options.near = Utils.CAMERA_DEFAULT_NEAR  unless options.near?
    options.far = Utils.CAMERA_DEFAULT_FAR unless options.far?
    options.type = Utils.CAMERA_DEFAULT_TYPE unless options.type
    new THREE[options.type](options.view_angle, options.aspect, options.near, options.far)

  # Create lights
  @light: (options = {}) ->
    options.position ?= {}
    options.position.x ?= Utils.LIGHT_DEFAULT_POSITION_X
    options.position.y ?= Utils.LIGHT_DEFAULT_POSITION_Y
    options.position.z ?= Utils.LIGHT_DEFAULT_POSITION_Z
    options.color ?= Utils.LIGHT_DEFAULT_COLOR

    light = new (THREE.DirectionalLight)(options.color)
    light.position.set options.position.x, options.position.y, options.position.z
    light.castShadow = true
    light.shadowCameraLeft = -60
    light.shadowCameraTop = -60
    light.shadowCameraRight = 60
    light.shadowCameraBottom = 60
    light.shadowCameraNear = 1
    light.shadowCameraFar = 1000
    light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 1024
    light.shadowDarkness = .7
    light

  # Create ambient lights
  #
  # @param [Color] color
  @ambientLight: (options = {}) ->
    options.color ?= Utils.AMBIENT_LIGHT_DEFAULT_COLOR

    new (THREE.AmbientLight)(options.color)

  # Create cubes with lambert material
  #
  # @param [Object] options containing size, material and color
  @cube: (options = {}) ->
    options.size = 1 unless options.size?
    options.material = 'MeshNormalMaterial' unless options.material?
    options.color = 0xff0000 unless options.color?
    box = new (THREE.BoxGeometry)(options.size, options.size, options.size)
    mat = new (THREE[options.material])(color: options.color)
    new (THREE.Mesh)(box, mat)

  # Clones a JsonModel from the JsonModelManager
  @model: (options = {}) ->
    throw new Error("key missing for: #{JSON.stringify(options)}") unless options.key?
    JsonModelManager.get().clone(options.key)

  # Creates a terrain
  @terrain: (options = {}) ->
    Terrain.fromJson(options)

  # Creates a particle group and mesh
  @particle: (options = {}) ->
    BaseParticle.fromJson(options)

  # Creates a plane
  #
  # @param [Object] options
  @plane: (options = {}) ->
    if options.size?
      options.width = options.size
      options.height = options.size
    else
      options.width ?= Utils.PLANE_DEFAULT_WIDTH
      options.height ?= Utils.PLANE_DEFAULT_HEIGHT
    options.wSegments ?= Utils.PLANE_DEFAULT_W_SEGMENTS
    options.hSegments ?= Utils.PLANE_DEFAULT_H_SEGMENTS
    options.color ?= Utils.PLANE_DEFAULT_COLOR
    options.class ?= 'PlaneBufferGeometry'

    if options.map?
      options.material = new (THREE.MeshBasicMaterial)(
        map: TextureManager.get().items[options.map]
        side: THREE.DoubleSide)
    else
      options.material ?= new (THREE.MeshBasicMaterial)(
        color: options.color
        side: THREE.DoubleSide)

    geometry = new (THREE[options.class])(options.width, options.height, options.wSegments, options.hSegments)
    new (THREE.Mesh)(geometry, options.material)

  # Enable shadows on the renderer
  #
  # @param [Renderer] renderer
  #
  @fancyShadows: (renderer) ->
    renderer.shadowMapEnabled = true
    renderer.shadowMapSoft = true
    renderer.shadowMapType = THREE.PCFShadowMap
    renderer.shadowMapAutoUpdate = true

  # Add a sky sphere from an image
  #
  # @param [options] json object for options
  #
  # @example
  #
  #   Utils.skySphere(textureUrl: 'url_to_image.png', radius: 450000, segments: 64)
  #   Utils.skySphere(map: 'texture_manager_key')
  @skySphere: (options = {}) ->
    throw 'options.textureUrl or options.map not defined' if !options.textureUrl? && !options.map?
    options.radius ?= Utils.SKY_SPHERE_DEFAULT_RADIUS
    options.segments ?= Utils.SKY_SPHERE_DEFAULT_SEGMENTS

    geom = new (THREE.SphereGeometry)(options.radius, options.segments, options.segments)
    if options.map?
      name = options.map
    else
      name = Utils.getKeyName(options.textureUrl, Utils.IMG_URLS)

    mat = new (THREE.MeshBasicMaterial)(
      map: TextureManager.get().items[name]
      side: THREE.BackSide
    )
    new (THREE.Mesh)(geom, mat)

  # Add a skybox
  #
  # @param [Array] imgUrls array of imgUrls
  # @param [Number] size of the box
  #
  # [
  #   '/assets/px.jpg'
  #   '/assets/nx.jpg'
  #   '/assets/py.jpg'
  #   '/assets/ny.jpg'
  #   '/assets/pz.jpg'
  #   '/assets/nz.jpg'
  # ]
  @skyBox = (imgUrls, size=900000) ->
    # TODO: check for imgUrls existance
    aCubeMap = THREE.ImageUtils.loadTextureCube(imgUrls)
    aCubeMap.format = THREE.RGBFormat
    aShader = THREE.ShaderLib['cube']
    aShader.uniforms['tCube'].value = aCubeMap
    aSkyBoxMaterial = new (THREE.ShaderMaterial)(
      fragmentShader: aShader.fragmentShader
      vertexShader: aShader.vertexShader
      uniforms: aShader.uniforms
      depthWrite: false
      side: THREE.BackSide)
    new (THREE.Mesh)(new (THREE.BoxGeometry)(size, size, size), aSkyBoxMaterial)

  # Create orbit controls
  #
  # @param [Engine3D] engine
  #
  # @example
  #   controls = Helper.orbitControls(engine)
  #
  # @example
  #   controls.enabled = false
  #
  # @see https://github.com/mrdoob/three.js/blob/master/examples/js/controls/OrbitControls.js
  # @see https://stackoverflow.com/questions/20058579/threejs-disable-orbit-camera-while-using-transform-control
  @orbitControls: (engine) ->
    new (THREE.OrbitControls)(engine.camera, engine.renderer.domElement)

  # Create fog
  #
  # @example
  #   scene.fog = Helper.fog('white', 0, 500)
  #
  # @see http://threejs.org/docs/#Reference/Scenes/Fog
  @fog: (options = {})->
    options.color = 0x000000 unless options.color?
    options.near = 0 unless options.near?
    options.far = 500 unless options.far?
    new THREE.Fog(options.color, options.near, options.far)

  # Create a grid
  @grid: (options = {}) ->
    options.size = 10 unless options.size?
    options.step = 1 unless options.step?
    options.color = 0xffffff unless options.color?
    options.colorCenterLine = options.color unless options.colorCenterLine?
    grid = new (THREE.GridHelper)(options.size, options.step)
    grid.setColors options.colorCenterLine, options.color
    grid

  # Creates a material from what is drawn on a canvas
  @materialFromCanvas: (canvas) ->
    texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    new THREE.MeshBasicMaterial(map: texture, transparent: true) # , side: THREE.DoubleSide)

  # An intersection plane
  #
  # @example
  #   @plane = Helper.intersectPlane()
  #   pos = raycaster.ray.intersectPlane(@plane)
  @intersectPlane: ->
    new THREE.Plane(new THREE.Vector3(0, 0, 1), -1)

  # http://sole.github.io/tween.js/examples/03_graphs.html
  @tween: (options = {}) ->
    throw new Error('options.target missing') unless options.target?
    throw new Error('options.mesh missing') unless options.mesh?

    options.relative ?= false
    options.duration ?= Helper.defaultTweenDuration
    options.kind ?= 'Linear'
    options.direction ?= 'None'

    options.position ?= options.mesh.position.clone()
    options.position.rX = options.mesh.rotation.x
    options.position.rY = options.mesh.rotation.y
    options.position.rZ = options.mesh.rotation.z

    if options.relative
      for e in ['x', 'y', 'z']
        if options.target[e]?
          options.target[e] += options.mesh.position[e]
        else
          options.target[e] = options.mesh.position[e]
      for e in ['rX', 'rY', 'rZ']
        if options.target[e]?
          options.target[e] += options.mesh.rotation[e.toLowerCase()[1]]
        else
          options.target[e] = options.mesh.rotation[e.toLowerCase()[1]]
    else
      options.target.x ?= options.position.x
      options.target.y ?= options.position.y
      options.target.z ?= options.position.z
      options.target.rX ?= options.position.rX
      options.target.rY ?= options.position.rY
      options.target.rZ ?= options.position.rZ

    throw new Error('target same as position') if options.position == options.target

    tween = new TWEEN.Tween(options.position).to(options.target, options.duration)
      .easing(TWEEN.Easing[options.kind][options.direction])
      .onUpdate( ->
        options.mesh.position.set(@x, @y, @z)
        options.mesh.rotation.set(@rX, @rY, @rZ)
      )
    tween
