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
    load: (key, url, callback) ->
      @loadCount += 1
      @loader.load url, (geometry, materials) ->
        mesh = new (THREE.SkinnedMesh)(geometry, new (THREE.MeshFaceMaterial)(materials))

        material = mesh.material.materials

        i = 0
        while i < materials.length
          mat = materials[i]
          mat.skinning = true
          i++

        throw 'mesh already has animations. not overwriting default behaviour' if mesh.animations?

        mesh.animations = []
        if mesh.geometry.animations?
          for anim in mesh.geometry.animations
            animation = new THREE.Animation(mesh, anim, THREE.AnimationHandler.CATMULLROM)
            mesh.animations.push animation

        window.JsonModelManager.get().models[key] = mesh
        callback(mesh)

    # Check if all objects which started loading have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@models).size()

  @get: () ->
    instance ?= new Singleton.JsonModelManager()

exports.JsonModelManager = JsonModelManager
