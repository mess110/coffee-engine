class SoundManager

  instance = null

  class PrivateClass
    constructor: () ->
      @sounds = {}

    add: (key, url) ->
      audio = document.createElement('audio')
      source = document.createElement('source')
      source.src = url
      audio.appendChild(source)

      @sounds[key] = audio

    play: (key) ->
      if key of @sounds
        @sounds[key].play()
      else
        console.log 'Sound with key: ' + key + ' not found!'

  @get: () ->
    instance ?= new PrivateClass()
