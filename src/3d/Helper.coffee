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

  @toggleFullscreen = Utils.toggleFullscreen
  @addCEButton = Utils.addCEButton
  @orientation = Utils.orientation
  @fade = Utils.fade
  @guid: Utils.guid
  @setCursor: Utils.setCursor
  @rgbToHex: Utils.rgbToHex

  @defaultTweenDuration = 1000

  @toVector3: (json) ->
    new (THREE.Vector3)(json.x, json.y, json.z)

  # Use JSON to clone an object
  @shallowClone: (json) ->
    JSON.parse(JSON.stringify(json))

  # Get a random number smaller than n or between min and max
  @random: (min, max, mult) ->
    unless max?
      max = min
      min = 0
    if mult?
      min *= mult
      max *= mult
    Math.floor(Math.random() * (max - min + 1)) + min

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
    light.shadow.camera.left = -60
    light.shadow.camera.top = -60
    light.shadow.camera.right = 60
    light.shadow.camera.bottom = 60
    light.shadow.camera.near = 1
    light.shadow.camera.far = 1000
    light.shadow.bias = -.0001
    light.shadow.mapSize.width = light.shadow.mapSize.height = 1024
    light.shadow.darkness = .7
    light

  # Create a directional light
  @directionalLight: (options = {}) ->
    @light(options)

  # Create ambient lights
  #
  # @param [Color] color
  @ambientLight: (options = {}) ->
    options.color ?= Utils.AMBIENT_LIGHT_DEFAULT_COLOR

    new (THREE.AmbientLight)(options.color)

  # Create a point light similar to a lightbulb
  @pointLight: (options = {}) ->
    options.color ?= Utils.POINT_LIGHT_DEFAULT_COLOR
    options.intensity ?= Utils.POINT_LIGHT_DEFAULT_INTENSITY
    options.distance ?= Utils.POINT_LIGHT_DEFAULT_DISTANCE
    options.decay ?= Utils.POINT_LIGHT_DEFAULT_DECAY

    new (THREE.PointLight)(options.color, options.intensity, options.distance, options.decay)

  # Create cubes with lambert material
  #
  # @param [Object] options containing size, material and color
  @cube: (options = {}) ->
    options.size = 1 unless options.size?
    options.material = 'MeshNormalMaterial' unless options.material?
    options.color = 0xff0000 unless options.color?
    box = new (THREE.BoxGeometry)(options.size, options.size, options.size)
    if options.map?
      mat = new (THREE.MeshBasicMaterial)(
        map: TextureManager.get().items[options.map]
        transparent: true
        side: THREE.DoubleSide)
    else
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
    BaseParticle2.fromJson(options)

  @mirror: (engine, options = {}) ->
    new Mirror(engine, options)

  @water: (engine, scene, options = {}) ->
    new Water(engine, scene, options)

  @graffiti: (assetJson) ->
    throw new Error('not a graffiti') if assetJson.type != 'graffiti'
    throw new Error('key missing') unless assetJson.key?

    json = SaveObjectManager.get().items[assetJson.key]

    material = MaterialManager.get().items[assetJson.key]
    unless material?
      @art = new ArtGenerator(width: json.width, height: json.height)
      @art.fromJson(json)

      material = @materialFromCanvas(@art.canvas)

    plane = @plane(json.plane)
    plane.material = material
    plane

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
      material = new (THREE.MeshBasicMaterial)(
        map: TextureManager.get().items[options.map]
        side: THREE.DoubleSide)
    else if options.material?
      materail = options.material
    else
      material = new (THREE.MeshBasicMaterial)(
        color: options.color
        side: THREE.DoubleSide)

    geometry = new (THREE[options.class])(options.width, options.height, options.wSegments, options.hSegments)
    new (THREE.Mesh)(geometry, material)

  # Enable shadows on the renderer
  #
  # @param [Renderer] renderer
  #
  @fancyShadows: (renderer) ->
    renderer.shadowMap.enabled = true
    renderer.shadowMap.soft = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.shadowMap.autoUpdate = true

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

  @sampleShader = () ->
    shader =
      uniforms:
        time:
          type: 'f'
          value: 0
        resolution:
          type: 'v2'
          value: new (THREE.Vector2)
      fragment: [
        'uniform float time;'
        'varying vec2 vUv;'
        ''
        'void main() {'
        '  vec2 position = -1.0 + 2.0 * vUv;'
        ''
        '  float red = abs(sin(position.x * position.y + time / 5.0));'
        '  float green = abs(sin(position.x * position.y + time / 4.0));'
        '  float blue = abs(sin(position.x * position.y + time / 3.0 ));'
        '  gl_FragColor = vec4(red, green, blue, 1.0);'
        '}'
      ].join('\n')
      vertex: [
        'varying vec2 vUv;'
        ''
        'void main() {'
        '  vUv = uv;'
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );'
        '}'
      ].join('\n')

    itemMaterial = new (THREE.ShaderMaterial)(
      uniforms: shader.uniforms
      vertexShader: shader.vertex
      fragmentShader: shader.fragment
    )
    mesh = new (THREE.Mesh)(new (THREE.BoxGeometry)(1, 1, 1), itemMaterial)
    mesh.shaderSrc = shader
    mesh

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
    new (THREE.GridHelper)(options.size, options.step, options.colorCenterLine, options.color)

  # Creates a material from what is drawn on a canvas
  @materialFromCanvas: (canvas) ->
    texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    texture.minFilter = THREE.LinearFilter
    new THREE.MeshBasicMaterial(map: texture, transparent: true) # , side: THREE.DoubleSide)

  # An intersection plane
  #
  # @example
  #   @plane = Helper.intersectPlane()
  #   pos = raycaster.ray.intersectPlane(@plane)
  @intersectPlane: ->
    new THREE.Plane(new THREE.Vector3(0, 0, 1), -1)

  # TODO: improve this, currently it always resets to the original position
  #
  # @example
  #   Helper.shake(engine.camera)
  @shake: (target, options = {}) ->
    options.kind ?= 'Cubic'
    options.direction ?= 'In'
    options.stepDuration ?= 150

    originalPos =
      x: target.position.x
      y: target.position.y
      z: target.position.z

    rand = Helper.random(100) / 100
    tweenArray = []
    for i in [0...20]
      randX = Helper.random(100) / 100
      randY = Helper.random(100) / 100
      randZ = Helper.random(100) / 100
      if Helper.random(100) < 50
        randX *= -1
      if Helper.random(100) < 50
        randY *= -1
      if Helper.random(100) < 50
        randZ *= -1

      tween = @tween(
        target: { x: randX, y: randY, z: randZ }
        mesh: target
        relative: true
        duration: options.stepDuration
        kind: options.kind
        direction: options.direction
      )
      tweenArray.push tween

    for i in [0...tweenArray.size()]
      continue unless tweenArray[i+1]?
      tweenArray[i].chain(tweenArray[i+1])

    tweenArray.last().onComplete (=>
      @tween(
        target: { x: originalPos.x, y: originalPos.y, z: originalPos.z }
        mesh: target
        relative: false
        duration: options.stepDuration
        kind: options.kind
        direction: options.direction
      ).start()
    )

    tweenArray[0].start()
    tweenArray

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

  # create a tween with a custom onUpdate and optional onComplete
  #
  # @param [Hash] options
  #
  # @see @tween
  #
  # @example
  #   tween = Helper.tweenCustom(
  #     src: {scale: 0.01 }, dest: { scale: 1}
  #     onUpdate: ->
  #       chicken.mesh.scale.set @scale, @scale, @scale
  #   )
  #
  # @example
  #   tween = Helper.tweenCustom(
  #     src: {scale: 0.01 }, dest: { scale: 1}, kind: 'Elastic', direction: 'Out', duration: 1000
  #     onUpdate: ->
  #       chicken.mesh.scale.set @scale, @scale, @scale
  #     onComplete: ->
  #       console.log 'done'
  #   )
  @tweenCustom: (options = {}) ->
    throw new Error('options.src missing') unless options.src?
    throw new Error('options.dest missing') unless options.dest?
    throw new Error('options.onUpdate missing') unless options.onUpdate?

    options.duration ?= Helper.defaultTweenDuration
    options.kind ?= 'Linear'
    options.direction ?= 'None'
    options.onComplete ?= -> {}

    tween = new TWEEN.Tween(options.src).to(options.dest, options.duration)
      .easing(TWEEN.Easing[options.kind][options.direction])
      .onUpdate(options.onUpdate)
      .onComplete(options.onComplete)
    tween

  # WIP
  @vrPointer: (camera, options = {}) ->
    cube = @cube(size: 0.5)

    scene = SceneManager.get().currentScene()
    scene.vrPointer = cube

    vector = new THREE.Vector3()
    camera.getWorldDirection(vector)

    cube.translateZ(-1)
    scene.scene.add cube


  # generate a forest of JsonModelManager
  #
  # @example
  #   node = Helper.forest(
  #     items: [
  #       {
  #         type: 'pinetree', count: 20
  #         scaleMin:
  #           x: 0.5
  #           y: 0.5
  #           z: 0.5
  #         scaleMax:
  #           x: 1.2
  #           y: 1.2
  #           z: 1.2
  #       }
  #     ]
  #     positionMin:
  #       x: 0,
  #       y: 0,
  #       z: 0
  #     positionMax:
  #       x: 2
  #       y: 0
  #       z: 2
  #   )
  #   scene.scene.add node
  @forest: (options = {}) ->
    options.items ?= []

    options.positionMin ?= {}
    options.positionMin.x ?= 0
    options.positionMin.y ?= 0
    options.positionMin.z ?= 0

    options.positionMax ?= {}
    options.positionMax.x ?= 10
    options.positionMax.y ?= 0
    options.positionMax.z ?= 10

    options.rotationMin ?= {}
    options.rotationMin.x ?= 0
    options.rotationMin.y ?= 0
    options.rotationMin.z ?= 0

    options.rotationMax ?= {}
    options.rotationMax.x ?= 0
    options.rotationMax.y ?= Math.PI
    options.rotationMax.z ?= 0

    options.scaleMin ?= {}
    options.scaleMin.x ?= 0.5
    options.scaleMin.y ?= 0.5
    options.scaleMin.z ?= 0.5

    options.scaleMax ?= {}
    options.scaleMax.x ?= 1.5
    options.scaleMax.y ?= 1.5
    options.scaleMax.z ?= 1.5

    node = new THREE.Object3D()

    coords = (item, options, attr, coord, which) ->
      s = "#{attr}#{which}"
      if item[s]? and item[s][coord]?
        item[s][coord]
      else
        options[s][coord]

    singleGeometry = new THREE.Geometry()
    for item in options.items
      item.count ?= 1
      for i in [0...item.count]
        model = JsonModelManager.get().clone(item.type)

        for attr in ['scale', 'position', 'rotation']
          attrHash =
            x: Helper.random(coords(item, options, attr, 'x', 'Min'), coords(item, options, attr, 'x', 'Max'), 1000) / 1000
            y: Helper.random(coords(item, options, attr, 'y', 'Min'), coords(item, options, attr, 'y', 'Max'), 1000) / 1000
            z: Helper.random(coords(item, options, attr, 'z', 'Min'), coords(item, options, attr, 'z', 'Max'), 1000) / 1000
          model[attr].set attrHash.x, attrHash.y, attrHash.z

        node.add model
        # model.updateMatrix()
        # singleGeometry.merge(model.geometry, model.matrix)

    # new THREE.Mesh(singleGeometry, mat)
    node

  # sends the server a reload package and sets up a reload listener
  # if the listener receives reload, it reloads the page
  @networkReload: ->
    nm = NetworkManager.get()

    unless nm._hasListener('reload')
      nm.on 'reload', (data) ->
        location.reload()

    nm.emit(type: 'reload')
