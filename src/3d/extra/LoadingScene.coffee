# A helper scene which loads models and calls a function once
# model loading is done
#
# @example
#   gameScene = new GameScene()
#   loadingScene = new LoadingScene(['sword.json'], () ->
#     engine.sceneManager.setScene(gameScene)
#   )
class LoadingScene extends BaseScene
  jmm: JsonModelManager.get()

  # You can either override the method hasFinishedLoading or you can
  # pass it as a param. It will be called once JsonModelManager has
  # finished loading.
  #
  # @param [Array] urls of the json models
  # @param [Function] hasFinishedLoading called 
  constructor: (urls, hasFinishedLoading = undefined)->
    super()

    throw 'urls needs to be an array' unless urls instanceof Array

    @hasFinishedLoading = hasFinishedLoading

    for url in urls
      name = url.replace('.json', '').split('/').last()
      console.log "Loading '#{name}' from '#{url}'" if Config.get().debug
      @jmm.load(name, url)

    interval = setInterval =>
      if @jmm.hasFinishedLoading()
        clearInterval(interval)
        @hasFinishedLoading()
    , 100

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
