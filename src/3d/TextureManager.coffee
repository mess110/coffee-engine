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
    load: (key, url, callback = -> {}) ->
      return if @items[key] != undefined
      @items[key] = null

      loader = new THREE.TextureLoader()
      texture = loader.load(url, (image) ->
        # By adding 100 ms delay to loading textures once loading is done
        # we prevent an ugly bug when texture.image is not set.
        # A propper fix is needed, not this hack
        setTimeout ->
          window.TextureManager.get()._load(image, key, callback)
        , 100
      , undefined, (err) ->
        console.log err
      )
      @

    # Checks if all the textures have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

    # @nodoc
    _load: (image, key, callback) ->
      window.TextureManager.get().items[key] = image
      window.TextureManager.get().loadCount += 1
      callback(key)

    item: (key) ->
      throw new Error("#{key} not found in TextureManager") unless @items[key]?
      @items[key]

  @get: () ->
    instance ?= new Singleton.TextureManager()

  @load: (key, url, callback) ->
    @get().load(key, url, callback)

  @item: (key) ->
    @get().item(key)

  @hasFinishedLoading: ->
    @get().hasFinishedLoading()
