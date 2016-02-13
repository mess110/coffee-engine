# @nodoc
class JsonModelManager
  instance = null

  # Handles loading JSON models
  class Singleton.JsonModelManager
    loader: new (THREE.JSONLoader)
    models: {}
    loadCount: 0

    # Load JSON model
    #
    # param [String] key
    # param [String] url to the json file
    # param [String] callback method called once the object is loaded
    #
    # @example
    #
    #   TODO
    load: (key, url, callback = -> {}) ->
      @loadCount += 1
      @loader.load url, (geometry, materials) ->
        jmm = window.JsonModelManager.get()

        mesh = new (THREE.SkinnedMesh)(geometry, new (THREE.MeshFaceMaterial)(materials))
        for mat in materials
          mat.skinning = true

        throw 'mesh already has animations. not overwriting default behaviour' if mesh.animations?

        mesh = jmm.initAnimations(mesh)
        jmm.models[key] = mesh
        callback(mesh)

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

    # Check if all objects which started loading have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@models).size()

  @get: () ->
    instance ?= new Singleton.JsonModelManager()

exports.JsonModelManager = JsonModelManager
