# @nodoc
class SoundManager

  instance = null

  # Class used to manage sounds
  #
  # Can be accessed through the singleton class SoundManager
  class Singleton.SoundManager
    sounds: {}
    loadCount: 0

    # Alias for add
    load: (key, url) ->
      return if @sounds[key] != undefined
      @sounds[key] = null
      url = [url] unless url instanceof Array

      howl = new Howl(
        autoplay: false
        urls: url
        onload: ->
          window.SoundManager.get().sounds[key] = howl
          window.SoundManager.get().loadCount += 1
      )

    # generic cmd for Howler
    cmd: (options = {}) ->
      throw new Error('options.type missing') unless options.type?
      throw new Error('options.key missing') unless options.key?

      unless options.key of @sounds
        throw new Error("Sound with key: #{options.key} not found!")
        return

      switch options.type
        when 'play', 'pause', 'stop'
          @sounds[options.key][options.type]()
        when 'fadeIn', 'fadeOut'
          options.to ?= 1
          options.duration ?= 1000
          @sounds[options.key][options.type](options.to, options.duration)
        when 'volume', 'volumeAll'
          options.volume ?= 1
          if options.type == 'volume'
            @sounds[options.key][options.type](options.volume)
          else
            @volumeAll(options.key, options.volume)
        when 'loop'
          options.loop ?= false
          @sounds[options.key][options.type](options.loop)
        else
          throw new Error("unknown options.type #{options.type}")

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
      @loadCount == Object.keys(@sounds).size()

    # Update the volume of all the loaded sounds
    volumeAll: (i) ->
      i = 0 if i < 0
      i = 1 if i > 1

      for key of @sounds
        @volume(key, i)

      i

  @get: () ->
    instance ?= new Singleton.SoundManager()
