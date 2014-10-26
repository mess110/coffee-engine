class ResourceManager

  instance = null

  class PrivateClass
    constructor: () ->
      @loadedImages = 0
      @totalImages = 0
      @images = {}

    addImage: (key, url) ->
      @totalImages += 1
      material = new THREE.MeshBasicMaterial
        transparent: true
        map: THREE.ImageUtils.loadTexture(url, {}, @_inc)
      @images[key] = material
      this

    image: (key) ->
      @images[key]

    hasFinishedLoading: ->
      @loadedImages == @totalImages

    # TODO fix haxor
    _inc: () ->
      ResourceManager.get().loadedImages += 1


  @get: () ->
    instance ?= new PrivateClass()
