# Creates and adds a heightmap to the current scene
#
# @example
#
#   Terrain.heightmap('/bower_components/ocean/assets/img/waternormals.jpg', 'heightmap.png', 20, 20, 5, 5)
#
# @example
#
#   hm = THREE.ImageUtils.loadTexture(options.heightmapUrl)
#   hm.heightData = Terrain.getHeightData(hm.image, options.scale)
#   terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments)
#   terrain.applyHeightmap(hm.heightData)
#
class Terrain extends BaseModel

  constructor: (textureUrl, width, height, wSegments, hSegments)->
    mat = new THREE.MeshLambertMaterial(
      map: THREE.ImageUtils.loadTexture(textureUrl)
    )
    geom = new (THREE.PlaneGeometry)(width, height, wSegments, hSegments)
    @mesh = new (THREE.Mesh)(geom, mat)
    @mesh.rotation.x -= Math.PI / 2

  applyHeightmap: (imageData) ->
    i = 0
    for vertice in @mesh.geometry.vertices
      vertice.z = imageData[i] / 10
      i++

  @heightmap: (textureUrl, heightmapUrl, width, height, wSegments, hSegments, scale=1, scene) ->
    hm = THREE.ImageUtils.loadTexture(heightmapUrl, THREE.UVMapping, () =>
      hm.heightData = Terrain.getHeightData(hm.image, scale)

      terrain = new Terrain(textureUrl, width, height, wSegments, hSegments)
      terrain.applyHeightmap(hm.heightData)

      scene = SceneManager.get().currentScene() unless scene?

      scene.terrain = terrain
      scene.scene.add terrain.mesh
    )

  @heightmap_blocking: (options) ->
    hm = THREE.ImageUtils.loadTexture(options.heightmapUrl)
    hm.heightData = Terrain.getHeightData(hm.image, options.scale)

    terrain = new Terrain(options.textureUrl, options.width, options.height, options.wSegments, options.hSegments)
    terrain.applyHeightmap(hm.heightData)

    scene = SceneManager.get().currentScene() unless scene?

    scene.terrain = terrain
    scene.scene.add terrain.mesh

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
