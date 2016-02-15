# A helper scene which loads models or images, and calls a function once
# loading is done
#
# @example
#   gameScene = new GameScene()
#   loadingScene = new LoadingScene(['sword.json'], () ->
#     engine.sceneManager.setScene(gameScene)
#   )
class LoadingScene extends BaseScene
  JSON_URLS = ['.json']
  IMG_URLS = ['.png', '.jpg', '.jpeg']

  jmm: JsonModelManager.get()
  tm: TextureManager.get()
  config: Config.get()

  # You can either override the method hasFinishedLoading or you can
  # pass it as a param. It will be called once JsonModelManager has
  # finished loading.
  #
  # @param [Array] urls of the json models or images
  # @param [Function] hasFinishedLoading called 
  constructor: (urls, hasFinishedLoading = undefined)->
    super()

    throw 'urls needs to be an array' unless urls instanceof Array

    @hasFinishedLoading = hasFinishedLoading

    for url in urls
      @_loadJsonModel(url) if url.endsWithAny(JSON_URLS)
      @_loadTexture(url) if url.endsWithAny(IMG_URLS)

    interval = setInterval =>
      if @jmm.hasFinishedLoading() and @tm.hasFinishedLoading()
        clearInterval(interval)
        console.log 'Finished loading' if @config.debug
        @hasFinishedLoading()
    , 100

  # assumes the url has been validated as a json model
  _loadJsonModel: (url) ->
    name = url.replaceAny(JSON_URLS, '').split('/').last()
    console.log "Loading model '#{name}' from '#{url}'" if @config.debug
    @jmm.load(name, url)

  # assumes the url has been validated as a texture
  _loadTexture: (url) ->
    name = url.replaceAny(IMG_URLS, '').split('/').last()
    console.log "Loading texture '#{name}' from '#{url}'" if @config.debug
    @tm.load(name, url)

  # @nodoc
  init: ->

  # @see BaseScene.tick
  tick: (tpf) ->

  # @nodoc
  doMouseEvent: (event, raycaster) ->

  # @nodoc
  doKeyboardEvent: (event) ->

  # Override this method. It gets called when the json models have finished
  # loading.
  #
  # For example, you can use it to start a difference scene
  hasFinishedLoading: ->
    if @hasFinishedLoading?
      @hasFinishedLoading()
    else
      throw 'not implemented'
