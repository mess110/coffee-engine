# @nodoc
class ResourceManager

  instance = null

  class PrivateResourceManager
    loadedTexturesCount: 0
    textures: {}

    addTexture: (key, url) ->
      texture = THREE.ImageUtils.loadTexture(url, {}, @_inc)
      @textures[key] = texture
      this

    texture: (key) ->
      @textures[key]

    hasFinishedLoading: ->
      @loadedTexturesCount == Object.keys(textures).length

    # TODO fix haxor
    _inc: () ->
      ResourceManager.get().loadedTexturesCount += 1

  @get: () ->
    instance ?= new PrivateResourceManager()
