# A helper scene which loads [models, images, save objects], and calls a
# function once loading is done
#
# Basic configuration of the loading scene can be done though LOADING_OPTIONS
#
# @todo - look into
#
# THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
#   console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
# };
#
# @example
#   LoadingScene.LOADING_OPTIONS.fillStyle = 'red'
#
# @example
#   gameScene = new GameScene()
#   loadingScene = new LoadingScene(['sword.json'], () ->
#     engine.sceneManager.setScene(gameScene)
#   )
class LoadingScene extends BaseScene

  @LOADING_OPTIONS =
    fillStyle: 'white'
    font: '64px Arial'
    align: 'center'
    text: 'loading'
    model: Helper.cube(color: 'white', size: 0.5)
    camera: Helper.camera()

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
      console.ce("Loaded #{@getLoadedPercent()}%")
      if @isLoadingDone()
        clearInterval(interval)
        console.ce 'Finished loading'
        @hasFinishedLoading()
    , 50

  # Override this to add more code which should be executed before loading starts
  preStart: ->
    engine = Hodler.item('engine')
    engine.setClearColor(0x000000)

    cam = LoadingScene.LOADING_OPTIONS.camera
    cam.position.set 0, 0, 10
    cam.lookAt Helper.zero
    engine.setCamera(cam)

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.light()

    @loadingAnimation = LoadingScene.LOADING_OPTIONS.model
    @loadingAnimation.position.set(0, -0.5, 0)
    @scene.add @loadingAnimation

    @text = new BaseText(LoadingScene.LOADING_OPTIONS)
    @text.mesh.position.set 0, -3, 0
    @scene.add @text.mesh

  # checks if the managers have finished loading
  isLoadingDone: ->
    @jmm.hasFinishedLoading() and @tm.hasFinishedLoading() and @som.hasFinishedLoading() and @sm.hasFinishedLoading()

  # Returns the total amount of loaded assets
  getLoadedCount: ->
    @jmm.loadCount + @tm.loadCount + @som.loadCount + @sm.loadCount

  # Returns the total amount of assets
  getAllAssetsCount: ->
    count = 0
    for loader in [@jmm, @tm, @som, @sm]
      count += Object.keys(loader.items).size()
    count

  # Returns the percentage of assets loaded
  getLoadedPercent: (decimals = 2)->
    Math.round(@getLoadedCount() / @getAllAssetsCount() * 100, decimals)

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
    if @loadingAnimation?
      @loadingAnimation.rotation.x += tpf
      @loadingAnimation.rotation.y += tpf

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
