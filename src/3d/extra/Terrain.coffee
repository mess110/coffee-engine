# Creates and adds a heightmap to the current scene
#
# @example
#   Terrain.heightmap('/bower_components/ocean/assets/img/waternormals.jpg', 'heightmap.png', 20, 20, 5, 5)
#
# @example
#   hm = THREE.ImageUtils.loadTexture(options.heightmapUrl)
#   hm.heightData = Terrain.getHeightData(hm.image, options.scale)
#   terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments)
#   terrain.applyHeightmap(hm.heightData)
#
class Terrain extends BaseModel

  # Creates the terrain
  constructor: (textureUrl, width, height, wSegments, hSegments)->
    if arguments.length == 1
      json = textureUrl # rename the param
      mat = new THREE.MeshLambertMaterial(
        map: TextureManager.get().items[Utils.getKeyName(json.textureUrl, Utils.IMG_URLS)]
      )
      geom = new (THREE.PlaneGeometry)(json.width, json.height, json.wSegments, json.hSegments)
    else
      mat = new THREE.MeshLambertMaterial(
        map: THREE.ImageUtils.loadTexture(textureUrl)
      )
      geom = new (THREE.PlaneGeometry)(width, height, wSegments, hSegments)
    @mesh = new (THREE.Mesh)(geom, mat)
    @mesh.rotation.x -= Math.PI / 2

  # Apply heightmap data retrieved from getHeightData
  #
  # @see getHeightData
  applyHeightmap: (imageData) ->
    i = 0
    for vertice in @mesh.geometry.vertices
      vertice.z = imageData[i]
      i++

  @fromJson: (json) ->
    hm = TextureManager.get().items[Utils.getKeyName(json.heightmapUrl, Utils.IMG_URLS)]
    hm.heightData = Terrain.getHeightData(hm.image, json.scale)
    terrain = new Terrain(json)
    terrain.applyHeightmap(hm.heightData)
    terrain

  # Hackish way to add a heightmap to the scene
  #
  # @param [String] textureUrl
  # @param [String] heightmapUrl
  # @param [Number] width
  # @param [Number] height
  # @param [Number] wSegments
  # @param [Number] hSegments
  # @param [Number] scale
  @heightmap: (textureUrl, heightmapUrl, width, height, wSegments, hSegments, scale=1, scene) ->
    hm = THREE.ImageUtils.loadTexture(heightmapUrl, THREE.UVMapping, () =>
      hm.heightData = Terrain.getHeightData(hm.image, scale)

      terrain = new Terrain(textureUrl, width, height, wSegments, hSegments)
      terrain.applyHeightmap(hm.heightData)

      scene = SceneManager.get().currentScene() unless scene?

      scene.terrain = terrain
      scene.scene.add terrain.mesh
    )

  # Another hackish way to add a heightmap to the scene
  #
  # @param [Object] options
  @heightmap_blocking: (options) ->
    hm = THREE.ImageUtils.loadTexture(options.heightmapUrl, THREE.UVMapping)
    hm.heightData = Terrain.getHeightData(hm.image, options.scale)

    terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments)
    terrain.applyHeightmap(hm.heightData)

    scene = SceneManager.get().currentScene() unless scene?

    scene.terrain = terrain
    scene.scene.add terrain.mesh

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
