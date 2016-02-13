# @nodoc
class StatsManager

  instance = null

  # Handles stats
  class PrivateStatsManager
    statsVisible: false

    # @nodoc
    constructor: () ->
      @stats = new Stats()
      @stats.domElement.style.position = 'absolute'
      @stats.domElement.style.top = '0px'

      @rendererStats = new THREEx.RendererStats()
      @rendererStats.domElement.style.position = 'absolute'
      @rendererStats.domElement.style.left = '0px'
      @rendererStats.domElement.style.bottom   = '0px'

    # Toggles the visibility of the stats
    toggle: ->
      @statsVisible = !@statsVisible
      if @statsVisible
        document.body.appendChild( @stats.domElement )
        document.body.appendChild( @rendererStats.domElement )
      else
        document.body.removeChild( @stats.domElement )
        document.body.removeChild( @rendererStats.domElement )
      @statsVisible

    # @nodoc
    update: (renderer) ->
      @stats.update()
      @rendererStats.update(renderer)

  @get: () ->
    instance ?= new PrivateStatsManager()
