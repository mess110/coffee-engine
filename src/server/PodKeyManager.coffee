# @nodoc
class Singleton

# @nodoc
class PodKeyManager
  instance = null

  # Singleton class to store all the client socket keys connected to
  # this pod.
  class Singleton.PodKeyManager
    keys: []

    # add a key to the array
    push: (key) ->
      @keys.push(key)

    # remove a key from the array
    remove: (key) ->
      @keys.remove(key)

  @get: () ->
    instance ?= new Singleton.PodKeyManager()

exports.PodKeyManager = PodKeyManager
