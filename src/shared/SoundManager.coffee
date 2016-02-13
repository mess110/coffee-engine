# @nodoc
class SoundManager

  instance = null

  # Class used to manage sounds
  #
  # Can be accessed through the singleton class SoundManager
  class Singleton.SoundManager
    sounds: {}

    # Add a sound
    add: (key, url) ->
      audio = document.createElement('audio')
      source = document.createElement('source')
      source.src = url
      audio.appendChild(source)
      audio.playbackRate = 1
      # audio.volume

      @sounds[key] = audio

    # Play a sound by key
    play: (key) ->
      if key of @sounds
        @sounds[key].play()
      else
        console.log 'Sound with key: ' + key + ' not found!'

    # Update the volume of all the loaded sounds
    updateGlobalVolume: (i) ->
      i = 0 if i < 0
      i = 1 if i > 1

      for key of @sounds
        @sounds[key].volume = i

      i

  @get: () ->
    instance ?= new Singleton.SoundManager()
