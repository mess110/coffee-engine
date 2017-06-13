# A helper scene which loads [models, images, save objects], and calls a
# function once loading is done
#
# @example
#   gameScene = new GameScene()
#   loadingScene = new LoadingScene(['sword.json'], () ->
#     engine.sceneManager.setScene(gameScene)
#   )
class LoadingScene extends BaseScene

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

    @preStart()
    @loadAssets(urls)

  # Loads assets
  #
  # @example
  #   loadingScene.loadAssets(['asset1.png'])
  #
  # @example
  #   loadingScene.loadAssets([ { destPath: 'asset1.png' } ])
  #
  loadAssets: (assets) ->
    for asset in assets
      if typeof asset == 'string'
        url = asset
      else
        url = asset.destPath

      if url.endsWithAny(Utils.SAVE_URLS)
        @_loadSaveObject(url)
      else if url.endsWithAny(Utils.JSON_URLS)
        @_loadJsonModel(url)
      else if url.endsWithAny(Utils.IMG_URLS)
        @_loadTexture(url)
      else if url.endsWithAny(Utils.AUDIO_URLS)
        @_loadAudio(url)
      else
        console.log "WARNING: #{url} is not a valid format"

    interval = setInterval =>
      if @isLoadingDone()
        clearInterval(interval)
        console.ce 'Finished loading'
        @hasFinishedLoading()
    , 100

  # Override this to add more code which should be executed before loading starts
  preStart: ->

  # checks if the managers have finished loading
  isLoadingDone: ->
    @jmm.hasFinishedLoading() and @tm.hasFinishedLoading() and @som.hasFinishedLoading() and @sm.hasFinishedLoading()

  # assumes the url has been validated as a json model
  _loadJsonModel: (url) ->
    name = Utils.getKeyName(url, Utils.JSON_URLS)
    console.ce "Loading model '#{name}' from '#{url}'"
    @jmm.load(name, url)

  # assumes the url has been validated as a texture
  _loadTexture: (url) ->
    name = Utils.getKeyName(url, Utils.IMG_URLS)
    console.ce "Loading texture '#{name}' from '#{url}'"
    @tm.load(name, url)

  # assumes the url has been validated as a jave object
  _loadSaveObject: (url) ->
    name = Utils.getKeyName(url, Utils.SAVE_URLS)
    console.ce "Loading save object '#{name}' from '#{url}'"
    @som.load(name, url)

  # assumes the url has been validated as a sound
  _loadAudio: (url) ->
    name = Utils.getKeyName(url, Utils.AUDIO_URLS)
    console.ce  "Loading audio '#{name}' from '#{url}'"
    @sm.load(name, url)

  # @nodoc
  init: ->
    @preStart()

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
