class Singleton

# Singleton class to store all the client socket keys connected to
# this pod.
class PodKeyManager
  instance = null

  class Singleton.PodKeyManager
    keys: []

    push: (key) ->
      @keys.push(key)

    remove: (key) ->
      @keys.remove(key)

  @get: () ->
    instance ?= new Singleton.PodKeyManager()

exports.PodKeyManager = PodKeyManager
