# @nodoc
class SoundManager

  instance = null

  # Class used to manage sounds
  #
  # Can be accessed through the singleton class SoundManager
  class Singleton.SoundManager
    items: {}
    loadCount: 0

    load: (key, url) ->
      return if @items[key] != undefined
      @items[key] = null
      url = [url] unless url instanceof Array

      howl = new Howl(
        autoplay: false
        urls: url
        onload: ->
          window.SoundManager.get()._loaded(key, howl)
      )

    _loaded: (key, howl) ->
      @items[key] = howl
      @loadCount += 1

    # generic cmd for Howler
    cmd: (options = {}) ->
      throw new Error('options.type missing') unless options.type?
      throw new Error('options.key missing') unless options.key?

      unless options.key of @items
        throw new Error("Sound with key: #{options.key} not found!")
        return

      switch options.type
        when 'play', 'pause', 'stop'
          @items[options.key][options.type]()
        when 'fadeIn', 'fadeOut'
          options.to ?= 1
          options.duration ?= 1000
          @items[options.key][options.type](options.to, options.duration)
        when 'volume', 'volumeAll'
          options.volume ?= 1
          if options.type == 'volume'
            @items[options.key][options.type](options.volume)
          else
            @volumeAll(options.volume)
        when 'loop'
          options.loop ?= false
          @items[options.key][options.type](options.loop)
        else
          throw new Error("unknown options.type #{options.type}")

      @items[options.key]

    # Play a sound by key
    play: (key) ->
      @cmd(type: 'play', key: key)

    # Pause a sound by key
    pause: (key) ->
      @cmd(type: 'pause', key: key)

    stop: (key) ->
      @cmd(type: 'stop', key: key)

    # fadeIn a sound by key
    fadeIn: (key, to) ->
      @cmd(type: 'fadeIn', key: key, to: to, duration: duration)

    # fadeOut a sound by key
    fadeOut: (key, to) ->
      @cmd(type: 'fadeOut', key: key, to: to, duration: duration)

    # set volume
    volume: (key, volume) ->
      @cmd(type: 'volume', key: key, volume: volume)

    # set looping
    looping: (key, looping) ->
      @cmd(type: 'loop', key: key, loop: looping)

    # Checks if all the textures have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

    # Update the volume of all the loaded sounds
    volumeAll: (i) ->
      i = 0 if i < 0
      i = 1 if i > 1

      for key of @items
        @volume(key, i)

      i

    has: (key) ->
      @items[key]?

  @get: () ->
    instance ?= new Singleton.SoundManager()

  @has: (key) ->
    @get().has(key)

  @play: (key) ->
    @get().play(key)

  @pause: (key) ->
    @get().pause(key)

  @stop: (key) ->
    @get().stop(key)

  @fadeIn: (key, to) ->
    @get().fadeIn(key, to)

  @fadeOut: (key, to) ->
    @get().fadeOut(key, to)

  @volume: (key, volume) ->
    @get().volume(key, volume)

  @looping: (key, looping) ->
    @get().looping(key, looping)

  @volumeAll: (i) ->
    @get().volumeAll(i)

  @load: (key, url) ->
    @get().load(key, url)

  @cmd: (options) ->
    @get().cmd(options)

  @hasFinishedLoading: ->
    @get().hasFinishedLoading()
