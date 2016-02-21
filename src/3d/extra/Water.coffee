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
    options.textureUrl ?= '/bower_components/ocean/assets/img/waternormals.jpg'
    options.width ?= 2000
    options.height ?= 2000
    options.wSegments ?= 10
    options.hSegments ?= 10
    options.water ?= {}
    options.water.textureWidth ?= 256
    options.water.textureHeight ?= 256
    options.water.alpha ?= 1.0
    options.water.sunColor ?= 0xffffff
    options.water.waterColor ?= 0x001e0f
    options.water.betaVersion ?= 0
    options.water.side ?= THREE.DoubleSide

    waterNormals = TextureManager.get().items[Utils.getKeyName(options.textureUrl, Utils.IMG_URLS)]
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
