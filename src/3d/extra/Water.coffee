# Used to generate water
#
# @example
#   @water = new Water(engine, @scene)
#   @scene.add @water.mesh
#
#   @water.tick(tpf)
#
# @see https://github.com/jbouny/ocean
class Water extends BaseModel
  # Create water
  constructor: (engine, scene, options = {}) ->
    throw new Error('map missing. needs to be a TextureManager key') unless options.map?
    # options.map ?= '/bower_components/ocean/assets/img/waternormals.jpg'
    options.width ?= Utils.PLANE_DEFAULT_WIDTH
    options.height ?= Utils.PLANE_DEFAULT_HEIGHT
    options.wSegments ?= Utils.PLANE_DEFAULT_W_SEGMENTS
    options.hSegments ?= Utils.PLANE_DEFAULT_H_SEGMENTS
    options.water ?= {}
    options.water.textureWidth ?= Utils.MIRROR_DEFAULT_TEXTURE_WIDTH / 2
    options.water.textureHeight ?= Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT / 2
    options.water.alpha ?= Utils.WATER_DEFAULT_ALPHA
    options.water.sunColor ?= Utils.LIGHT_DEFAULT_COLOR
    options.water.waterColor ?= Utils.WATER_DEFAULT_WATER_COLOR
    options.water.betaVersion ?= 0
    options.water.side ?= THREE.DoubleSide

    waterNormals = TextureManager.get().items[options.map]
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

    options.water.waterNormals = waterNormals

    @water = new (THREE.Water)(engine.renderer, engine.camera, scene, options.water)

    @mesh = new (THREE.Mesh)(new (THREE.PlaneBufferGeometry)(options.width, options.height, options.wSegments, options.hSegments), @water.material)
    @mesh.add @water
    @mesh.rotation.x = -Math.PI * 0.5

    @speed = 1

  # Used to update the water animation.
  #
  # Should be called in scene.tick
  tick: (tpf) ->
    @water.material.uniforms.time.value += tpf * @speed
    @water.render()
