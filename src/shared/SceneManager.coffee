# @nodoc
class SceneManager

  instance = null

  # Class used to manage scenes
  #
  # Can be accessed through the singleton class SceneManager
  class Singleton.SceneManager
    scenes: []
    currentSceneIndex: undefined

    # Returns the current scene
    currentScene: ->
      throw new Error('SceneManager.setScene not called') unless @currentSceneIndex?
      throw new Error('Requires at least one scene') if @isEmpty()
      @scenes[@currentSceneIndex]

    # Adds a scene if it is not found in @scenes
    addScene: (scene) ->
      throw new Error('missing scene param') unless scene?
      i = @scenes.indexOf(scene)
      @scenes.push scene if i == -1

    # removes a scene
    removeScene: (scene) ->
      throw new Error('missing scene param') unless scene?
      i = @scenes.indexOf(scene)
      @removeSceneByIndex(i)

    # removes a scene by index
    removeSceneByIndex: (i) ->
      if i >= 0
        if i == @currentSceneIndex
          @currentSceneIndex = undefined
        array.splice(i, 1)

    # sets the scene
    setScene: (scene) ->
      throw new Error('missing scene param') unless scene?
      i = @scenes.indexOf(scene)
      throw new Error('scene not added to SceneManager') if i == -1
      @setSceneByIndex(i)
      @currentScene()

    # sets the scene by index
    setSceneByIndex: (i) ->
      throw new Error('invalid scene index') if @isEmpty() or !@isValidIndex(i)
      @currentSceneIndex = i
      scene = @currentScene()

      debugMsg = "Changing to scene #{i}"
      try
        debugMsg += ": #{scene.constructor.name}"
      catch e
      console.ce debugMsg

      scene

    # checks if there are scenes added to the SceneManager
    isEmpty: ->
      @scenes.length == 0

    # @nodoc
    isValidIndex: (i) ->
      0 <= i and i < @scenes.length

    hasScene: (scene) ->
      @scenes.includes(scene)

    # ticks the scene
    tick: (tpf) ->
      @currentScene().fullTick(tpf)

  @get: () ->
    instance ?= new Singleton.SceneManager()

  @currentScene: ->
    @get().currentScene()

  @addScene: (scene) ->
    @get().addScene(scene)
