# @nodoc
class StatsManager

  instance = null

  # Handles stats
  class Singleton.StatsManager
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

    # Set stat visibility
    setVisible: (value) ->
      if value != @statsVisible
        @toggle()

    # @nodoc
    update: (renderer) ->
      return unless @statsVisible
      @stats.update()
      @rendererStats.update(renderer)

  @get: () ->
    instance ?= new Singleton.StatsManager()

  @toggle: ->
    @get().toggle()

  @setVisible: ->
    @get().setVisible()

  @update: (renderer) ->
    @get().update(renderer)
