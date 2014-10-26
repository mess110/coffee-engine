class SceneManager

  instance = null

  class PrivateClass
    constructor: () ->
      @scenes = []
      @currentSceneIndex = undefined

    currentScene: ->
      throw 'SceneManager.setScene not called' if @currentSceneIndex == undefined
      throw 'Requires at least one scene' if @scenes.length == 0

      @scenes[@currentSceneIndex]

    # Adds a scene if it is not found in @scenes
    addScene: (scene) ->
      i = @scenes.indexOf(scene)
      @scenes.push scene if i == -1

    removeScene: (scene) ->
      i = @scenes.indexOf(scene)
      @removeSceneByIndex(i)

    removeSceneByIndex: (i) ->
      if i >= 0
        if i == @currentSceneIndex
          @currentSceneIndex = undefined
        array.splice(i, 1)

    setScene: (scene) ->
      i = @scenes.indexOf(scene)
      @setSceneByIndex(i)
      @currentScene()

    setSceneByIndex: (i) ->
      if !@isEmpty() and @isValidIndex(i)
        @currentSceneIndex = i
      @currentScene()

    isEmpty: ->
      @scenes.length == 0

    isValidIndex: (i) ->
      0 <= i and i < @scenes.length

    tick: (tpf) ->
      @currentScene().tick(tpf)

  @get: () ->
    instance ?= new PrivateClass()
