# @nodoc
class VideoRecorderManager

  instance = null

  class Singleton.VideoRecorderManager

    constructor: ->
      @recorder = new CCapture(Config.get().recorder)

    capture: (domElement) ->
      @recorder.capture(domElement)

    start: ->
      @recorder.start()

    stop: ->
      @recorder.stop()

    save: ->
      @recorder.save()

  @get: () ->
    instance ?= new Singleton.VideoRecorderManager()

  @start: ->
    @get().start()

  @stop: ->
    @get().stop()

  @save: ->
    @get().save()

  @capture: (domElement) ->
    @get().capture(domElement)
