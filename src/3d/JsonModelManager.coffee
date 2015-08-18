class JsonModelManager
  instance = null

  class PrivateClass
    constructor: () ->
      @loader = new (THREE.JSONLoader)
      @models = {}
      @loadCount = 0

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
        for anim in mesh.geometry.animations
          animation = new THREE.Animation(mesh, anim, THREE.AnimationHandler.CATMULLROM)
          mesh.animations.push animation

        JsonModelManager.get().models[key] = mesh
        callback(mesh)

    hasFinishedLoading: ->
      @loadCount == Object.keys(@models).size()

  @get: () ->
    instance ?= new PrivateClass()
