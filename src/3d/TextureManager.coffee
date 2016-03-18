# @nodoc
class TextureManager

  instance = null

  # Handles loading textures
  class Singleton.TextureManager
    items: {}
    loadCount: 0

    # Add a texture
    #
    # @param [String] key
    # @param [String] url of the texture
    load: (key, url) ->
      texture = THREE.ImageUtils.loadTexture(url, {}, @_load)
      @items[key] = texture
      @

    # Checks if all the textures have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

    # @nodoc
    _load: (image) ->
      window.TextureManager.get().loadCount += 1

  @get: () ->
    instance ?= new Singleton.TextureManager()
