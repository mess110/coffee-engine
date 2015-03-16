class Config

  instance = null

  class PrivateClass
    constructor: () ->
      @showStatsOnLoad = false
      @contextMenuDisabled = true
      @antialias = true
      @anaglyph = false
      @anaglyphDistance = 600
      @resize = false
      @width = 1280
      @height = 720
      @soundEnabled = false
      @debug = false

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

    toggleFullScreen: () ->
      EngineUtils.toggleFullScreen()

  @get: () ->
    instance ?= new PrivateClass()

exports.Config = Config
