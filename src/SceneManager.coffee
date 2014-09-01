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

    addScene: (scene) ->
      @scenes.push scene

    removeScene: (scene) ->
      index = @scenes.indexOf(scene)
      if index > -1
        array.splice(index, 1)

    setScene: (i) ->
      @currentSceneIndex = i

    isEmpty: ->
      @scenes.length == 0

    tick: (tpf) ->
      @currentScene().tick(tpf)

  @get: () ->
    instance ?= new PrivateClass()
