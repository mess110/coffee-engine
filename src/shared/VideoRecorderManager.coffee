# @nodoc
class VideoRecorderManager

  instance = null

  class Singleton.VideoRecorderManager

    constructor: ->
      @recording = false

    capture: (domElement) ->
      return if @recording == false
      @recorder.capture(domElement)

    start: ->
      unless @recorder?
        @recorder = new CCapture(Config.get().recorder)
      @recorder.start()
      @recording = true

    stop: ->
      @recorder.stop()
      @recording = false

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
