# Creates and adds a heightmap to the current scene
#
# @example
#   Terrain.heightmap('/node_modules/ocean/assets/img/waternormals.jpg', 'heightmap.png', 20, 20, 5, 5)
#
# @example
#   hm = THREE.ImageUtils.loadTexture(options.heightmapUrl)
#   hm.heightData = Terrain.getHeightData(hm.image, options.scale)
#   terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments)
#   terrain.applyHeightmap(hm.heightData)
#
# @example
#   # assuming you are using a LoadingScene
#   json = SaveObjectManager.get().items['terrain']
#   @scene.add Terrain.fromJson(json).mesh
#
class Terrain extends BaseModel

  # Creates the terrain
  constructor: (textureUrl, width, height, wSegments, hSegments)->
    if arguments.length == 1
      json = textureUrl # rename the param
      key = Utils.getKeyName(json.texture.destPath, Utils.IMG_URLS)
      mat = new THREE.MeshLambertMaterial(
        map: TextureManager.get().items[key]
      )
      geom = new (THREE.PlaneGeometry)(json.width, json.height, json.wSegments, json.hSegments)
    else
      mat = new THREE.MeshLambertMaterial(
        map: THREE.ImageUtils.loadTexture(textureUrl)
      )
      geom = new (THREE.PlaneGeometry)(width, height, wSegments, hSegments)

    @mesh = new (THREE.Mesh)(geom, mat)
    @mesh.rotation.x -= Math.PI / 2

    @raycaster = new (THREE.Raycaster)

  # Get height at a specific position.
  #
  # A ray is cast from the top of the position returning the height at the
  # intersection point
  #
  # @example
  #   height = @terrain.getHeightAt(@cube.position)
  #   @cube.position.y = height
  getHeightAt: (position) ->
    @raycaster.set(new THREE.Vector3(position.x, 1000, position.z), Helper.down)
    intersects = @raycaster.intersectObject(@mesh)
    if intersects[0]? then intersects[0].point.y else 0

  # Apply heightmap data retrieved from getHeightData
  #
  # @see getHeightData
  applyHeightmap: (imageData) ->
    i = 0
    for vertice in @mesh.geometry.vertices
      vertice.z = imageData[i]
      i++

  # Hackish way to add a heightmap to the scene
  #
  # @param [String] textureUrl
  # @param [String] heightmapUrl
  # @param [Number] width
  # @param [Number] height
  # @param [Number] wSegments
  # @param [Number] hSegments
  # @param [Number] scale
  # @param [Scene] scene
  @heightmap: (textureUrl, heightmapUrl, width, height, wSegments, hSegments, scale=1, scene) ->
    THREE.ImageUtils.loadTexture(heightmapUrl, THREE.UVMapping, (hm) =>
      hm.heightData = Terrain.getHeightData(hm.image, scale)

      wSegments = hm.image.width - 1 unless wSegments?
      hSegments = hm.image.height - 1 unless hSegments?

      terrain = new Terrain(textureUrl, width, height, wSegments, hSegments)
      terrain.applyHeightmap(hm.heightData)

      scene = SceneManager.currentScene() unless scene?

      scene.terrain = terrain
      scene.scene.add terrain.mesh
    )

  # Returns height data of an Image object
  #
  # @param [Image] img
  # @param [Number] scale
  @getHeightData: (img, scale = 1) ->
    canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    context = canvas.getContext('2d')
    size = img.width * img.height
    data = new Float32Array(size)
    context.drawImage img, 0, 0
    i = 0
    while i < size
      data[i] = 0
      i++
    imgd = context.getImageData(0, 0, img.width, img.height)
    pix = imgd.data
    j = 0
    i = 0
    while i < pix.length
      all = pix[i] + pix[i + 1] + pix[i + 2]
      data[j++] = all / (12 * scale)
      i += 4
    data

  # Propper way to load a terrain using TextureManager
  #
  # @param [Object] json
  @fromJson: (assetJson) ->
    throw new Error('not a terrain') if assetJson.type != 'terrain'
    throw new Error('key missing') unless assetJson.key?

    json = SaveObjectManager.get().items[assetJson.key]

    for key in ['width', 'height', 'scale', 'texture', 'heightmap']
      throw new Error("#{key} missing for terrain") unless json[key]?
    for key in ['texture', 'heightmap']
      throw new Error("#{key}.destPath missing for terrain") unless json[key].destPath?

    key = Utils.getKeyName(json.heightmap.destPath, Utils.IMG_URLS)
    hm = TextureManager.get().items[key]
    hm.heightData = Terrain.getHeightData(hm.image, json.scale)
    json.wSegments ?= hm.image.width - 1
    json.hSegments ?= hm.image.height - 1
    terrain = new Terrain(json)
    terrain.applyHeightmap(hm.heightData)
    terrain
