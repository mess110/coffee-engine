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
  class PrivateConfig

    showStatsOnLoad: true
    contextMenuDisabled: true
    antialias: true
    anaglyph: false
    resize: false
    width: 1280
    height: 1024
    soundEnabled: false
    debug: false
    preventDefaultMouseEvents: true
    animate: true
    transparentBackground: false

    fillWindow: () ->
      @resize = true
      @width = window.innerWidth
      @height = window.innerHeight

    toggleAnaglyph: () ->
      @anaglyph = !@anaglyph

    toggleStats: () ->
      StatsManager.get().toggle()

    toggleSound: () ->
      @soundEnabled = !@soundEnabled

    toggleDebug: () ->
      @debug = !@debug

    # @see EngineUtils.toggleFullScreen
    toggleFullScreen: () ->
      EngineUtils.toggleFullScreen()

  @get: () ->
    instance ?= new PrivateConfig()

exports.Config = Config
