class Config

  instance = null

  class PrivateClass
    constructor: () ->
      @showStatsOnLoad = false
      @contextMenuDisabled = true
      @antialias = true
      @anaglyph = false
      @anaglyphDistance = 600
      @resize = true
      @width = 1280
      @height = 720
      @soundEnabled = false

    toggleAnaglyph: () ->
      @anaglyph = !@anaglyph

    toggleStats: () ->
      StatsManager.get().toggle()

    toggleSound: () ->
      @soundEnabled = !@soundEnabled

  @get: () ->
    instance ?= new PrivateClass()

exports.Config = Config
