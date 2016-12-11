# @nodoc
class Config

  instance = null

  # Holds config variables
  #
  # Can be accessed through the singleton class Config
  #
  # @example How to access config object
  #   config = Config.get()
  #   console.log config
  class Singleton.Config

    showStatsOnLoad: false
    contextMenuDisabled: true
    antialias: true
    anaglyph: false
    stereoVR: false
    resize: false
    width: 1280
    height: 1024
    soundEnabled: false
    debug: false
    preventDefaultMouseEvents: true
    transparentBackground: false

    # by disabling this you are:
    #
    #   (a) entering a world of pain
    #   (b) making a card game - if so, there is a better way to overlay Planes.
    #     You can set the mesh.renderOrder and it will render in that order.
    sortObjects: true

    # Fill window
    #
    # Call this before creating the engine.
    #
    # @example
    #
    #   Config.get().fillWindow()
    #   engine = new Engine3D()
    #
    # If you want to call this after, you should also reset the existing camera
    # for changes to take effect
    #
    # @example
    #
    #   engine = new Engine3D()
    #   Config.get().fillWindow()
    #   engine.setCamera(engine.camera)
    fillWindow: () ->
      @resize = true
      @width = window.innerWidth
      @height = window.innerHeight

    # Toggle anaglyph flag
    toggleAnaglyph: () ->
      @anaglyph = !@anaglyph

    # Toggle stats
    #
    # @see StatsManager
    toggleStats: () ->
      StatsManager.toggle()

    # Toggle sound flag
    toggleSound: () ->
      @soundEnabled = !@soundEnabled

    # Toggle debug flag
    toggleDebug: () ->
      @debug = !@debug

    # @see Utils.toggleFullscreen
    toggleFullscreen: () ->
      Utils.toggleFullscreen()

  @get: () ->
    instance ?= new Singleton.Config()

  @fillWindow: ->
    @get().fillWindow()

  @toggleAnaglyph: ->
    @get().toggleAnaglyph()

  @toggleStats: ->
    @get().toggleStats()

  @toggleSound: ->
    @get().toggleSound()

  @toggleDebug: ->
    @get().toggleDebug()

  @toggleFullscreen: ->
    @get().toggleFullscreen()

exports.Config = Config
