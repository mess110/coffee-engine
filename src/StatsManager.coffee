class StatsManager

  instance = null

  class PrivateClass
    constructor: () ->
      @statsVisible = false

      @stats = new Stats()
      @stats.domElement.style.position = 'absolute'
      @stats.domElement.style.top = '0px'

      @rendererStats = new THREEx.RendererStats()
      @rendererStats.domElement.style.position = 'absolute'
      @rendererStats.domElement.style.left = '0px'
      @rendererStats.domElement.style.bottom   = '0px'

    toggle: ->
      @statsVisible = !@statsVisible
      if @statsVisible
        document.body.appendChild( @stats.domElement )
        document.body.appendChild( @rendererStats.domElement )
      else
        document.body.removeChild( @stats.domElement )
        document.body.removeChild( @rendererStats.domElement )
      @statsVisible

    update: (renderer) ->
      @stats.update()
      @rendererStats.update(renderer)

  @get: () ->
    instance ?= new PrivateClass()
