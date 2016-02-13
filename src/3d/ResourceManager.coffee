# @nodoc
class ResourceManager

  instance = null

  # Handles loading textures
  class Singleton.ResourceManager
    loadedTexturesCount: 0
    textures: {}

    # Add a texture
    #
    # @param [String] key
    # @param [String] url of the texture
    addTexture: (key, url) ->
      texture = THREE.ImageUtils.loadTexture(url, {}, @_inc)
      @textures[key] = texture
      this

    # Return a texture by key
    #
    # @param [String] key
    texture: (key) ->
      @textures[key]

    # Checks if all the textures have finished loading
    hasFinishedLoading: ->
      @loadedTexturesCount == Object.keys(textures).length

    # @nodoc
    _inc: () -> # TODO: fix hax0r
      ResourceManager.get().loadedTexturesCount += 1

  @get: () ->
    instance ?= new Singleton.ResourceManager()
