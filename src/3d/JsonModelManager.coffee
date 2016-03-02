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
      @loadCount += 1
      @loader.load "#{@baseUrl}#{url}", (geometry, materials) ->
        jmm = window.JsonModelManager.get()

        mesh = new (THREE.SkinnedMesh)(geometry, new (THREE.MeshFaceMaterial)(materials))
        for mat in materials
          mat.skinning = true

        throw 'mesh already has animations. not overwriting default behaviour' if mesh.animations?

        mesh = jmm.initAnimations(mesh)
        jmm.items[key] = mesh
        callback(mesh)
        @

    # Used to init or re-init animations
    #
    # Can also be useful when trying to clone animated objects as clone() from
    # THREEJS doesn't also clone the created THREE.Animation
    initAnimations: (mesh) ->
      mesh.animations = []
      if mesh.geometry.animations?
        for anim in mesh.geometry.animations
          animation = new THREE.Animation(mesh, anim, THREE.AnimationHandler.CATMULLROM)
          mesh.animations.push animation
      mesh

    # Clone an item with animations
    clone: (key) ->
      mesh = @_hack(@items[key].clone())
      @initAnimations(mesh)

    # @nodoc
    # When cloning a SkinnedMesh, three.js doesn't clone the materials so
    # we need to do that
    _hack: (mesh) ->
      mesh.material = mesh.material.clone()
      # mesh.material.needsUpdate = true
      # mesh.material.materials[0] = mesh.material.materials[0].clone()
      # mesh.material.materials[0].needsUpdate = true
      mesh.material.materials[0].map = mesh.material.materials[0].map.clone()
      mesh.material.materials[0].map.needsUpdate = true
      mesh

    # Check if all objects which started loading have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

  @get: () ->
    instance ?= new Singleton.JsonModelManager()

exports.JsonModelManager = JsonModelManager
