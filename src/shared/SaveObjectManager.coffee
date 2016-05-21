# @nodoc
class SaveObjectManager

  instance = null

  # Handles loading saved objects from terrain generator or particle playground
  #
  # @example
  #   json = SaveObjectManager.get().items['terrain']
  #   terrain = Terrain.fromJson(json)
  #   @scene.add terrain.mesh
  #
  # @example
  #   json = SaveObjectManager.get().items['particle']
  #   @particle = BaseParticle.fromJson(json)
  #   @scene.add @particle.mesh
  #
  #   @particle.tick(tpf)
  #
  # @see Terrain.fromJson
  # @see Particle.fromJson
  class Singleton.SaveObjectManager
    items: {}
    loadCount: 0

    # Add a saved object which is loaded through an XMLHttpRequest
    #
    # @param [String] key
    # @param [String] url of the object
    load: (key, url) ->
      @items[key] = null

      request = new XMLHttpRequest
      request.open 'GET', url, true

      request.onload = ->
        if request.status >= 200 and request.status < 400
          # Success!
          try
            data = JSON.parse(request.responseText)
          catch
            console.log "invalid json #{url}"
            return

          som = window.SaveObjectManager.get()
          som.items[key] = data
          som._load()
        else
          # We reached our target server, but it returned an error
        return

      request.onerror = ->
        console.log "error loading #{url}"
        return

      request.send()
      @

    # Checks if all the saved objects have finished loading
    hasFinishedLoading: ->
      @loadCount == Object.keys(@items).size()

    # @nodoc
    _load: () ->
      window.SaveObjectManager.get().loadCount += 1

  @get: () ->
    instance ?= new Singleton.SaveObjectManager()
