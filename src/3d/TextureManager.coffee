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
      return if @items[key] != undefined
      @items[key] = null

      texture = THREE.ImageUtils.loadTexture(url, {}, (image) ->
        window.TextureManager.get()._load(image, key)
      )
      @

    # Checks if all the textures have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

    # @nodoc
    _load: (image, key) ->
      window.TextureManager.get().items[key] = image
      window.TextureManager.get().loadCount += 1

  @get: () ->
    instance ?= new Singleton.TextureManager()
