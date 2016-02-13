# Helpers to get you started.
#
# Contains useful things like Helper.zero and Helper.one which are quite
# commonly used vectors in 3d programming. Just remember to clone them :)
#
# @see http://threejs.org/docs/#Reference/Math/Vector3
# @see http://blog.romanliutikov.com/post/58322336872/setup-scene-in-threejs
class Helper

  @zero: new THREE.Vector3(0, 0, 0)
  @one: new THREE.Vector3(1, 1, 1)

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
  #
  @camera: (options={}) ->
    config = Config.get()
    options.view_angle = 45 unless options.view_angle?
    options.aspect = config.width / config.height unless options.aspect?
    options.near = 1 unless options.near?
    options.far = 10000 unless options.far?
    options.type = 'PerspectiveCamera' unless options.type
    new THREE[options.type](options.view_angle, options.aspect, options.near, options.far)

  # Create lights
  @light: ->
    light = new (THREE.DirectionalLight)(0xffffff)
    light.position.set 0, 100, 60
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
  @ambientLight: ->
    new (THREE.AmbientLight)(0x404040)

  # Create cubes with lambert material
  #
  # @param [Number] size of the cube
  #
  @cube: (size) ->
    box = new (THREE.BoxGeometry)(size, size, size)
    mat = new (THREE.MeshLambertMaterial)(color: 0xff0000)
    new (THREE.Mesh)(box, mat)

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
  # @param [String] imgUrl for the image displayed
  # @param [Number] radius of the sphere
  # @param [Number] segments of the sphere
  #
  # @example
  #
  #   Utils.skySphere('', 450000, 64)
  @skySphere: (imgUrl, radius=450000, segments=64)->
    geom = new (THREE.SphereGeometry)(radius, segments, segments)
    mat = new (THREE.MeshBasicMaterial)(
      map: THREE.ImageUtils.loadTexture(imgUrl)
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
