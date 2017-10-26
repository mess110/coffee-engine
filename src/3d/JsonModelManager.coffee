# @nodoc
class JsonModelManager
  instance = null

  # Handles loading JSON models
  class Singleton.JsonModelManager
    baseUrl: ''
    loader: new (THREE.JSONLoader)
    items: {}
    loadCount: 0

    # Load JSON model and store it in @items under a specified key
    #
    # param [String] key
    # param [String] url to the json file
    # param [String] callback method called once the object is loaded
    #
    # @see Singleton.JsonModelManager.hasFinishedLoading()
    #
    # @example
    #    jmm = JsonModelManager.get()
    #    jmm.load('key', 'url/to/file.json')
    load: (key, url, callback = -> {}) ->
      return if @items[key] != undefined
      @items[key] = null

      @loader.load "#{@baseUrl}#{url}", (geometry, materials) ->
        jmm = window.JsonModelManager.get()

        mesh = new (THREE.SkinnedMesh)(geometry, materials)
        for mat in materials
          mat.skinning = true

        throw 'mesh already has animations. not overwriting default behaviour' if mesh.animations?

        mesh = jmm.initAnimations(mesh)
        jmm.items[key] = mesh
        jmm.loadCount += 1
        callback(mesh)
        @

    # Used to init or re-init animations
    #
    # Can also be useful when trying to clone animated objects as clone() from
    # THREEJS doesn't also clone the created THREE.Animation
    initAnimations: (mesh) ->
      throw new Error('missing param mesh') unless mesh?

      mesh.animations = []
      mesh.animationsMixer = new THREE.AnimationMixer(mesh)

      if mesh.geometry.animations?
        for anim in mesh.geometry.animations
          animation = mesh.animationsMixer.clipAction(anim)
          animation.setEffectiveWeight(1)
          mesh.animations.push animation

      mesh

    # Clone an item with animations
    clone: (key) ->
      throw new Error("key '#{key}' not found for JsonModelManager") unless @items[key]?
      mesh = @_hack(@items[key].clone())
      @initAnimations(mesh)

    # @nodoc
    # When cloning a SkinnedMesh, three.js doesn't clone the materials so
    # we need to do that
    #
    # TODO: find out if this is still true
    _hack: (mesh) ->
      materials = []
      for mat in mesh.material
        clone = mat.clone()
        clone.map = clone.map.clone()
        clone.map.needsUpdate = true
        materials.push clone

      mesh.material = materials
      mesh

    # Check if all objects which started loading have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

  @get: () ->
    instance ?= new Singleton.JsonModelManager()

  @clone: (key) ->
    @get().clone(key)

  @load: (key, url, callback) ->
    @get().load(key, url, callback)

  @initAnimations: (mesh) ->
    @get().initAnimations(mesh)

exports.JsonModelManager = JsonModelManager
