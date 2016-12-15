# Handle object pooling for BaseModel classes
#
# @example
#   PoolManager.on 'spawn', Card, (item) ->
#     pos = Helper.random(-5, 5)
#     item.mesh.position.set pos, pos, pos
#     SceneManager.currentScene().scene.add item.mesh
#
#   PoolManager.onRelease Card, (item) ->
#     SceneManager.currentScene().scene.remove item.mesh
#
#   item = PoolManager.spawn(Card)
#   PoolManager.release(item)
#
#   PoolManager.releaseAll()
class PoolManager

  instance = null

  class Singleton.PoolManager
    validEvents: ['spawn', 'release']

    items: {}
    itemsInUse: {}

    spawnEvents: {}
    releaseEvents: {}

    # @param [BaseModel Class] type
    spawn: (type) ->
      @_validation(type)

      if @items[type].isEmpty()
        item = new type()
      else
        item = @items[type].shift()

      @itemsInUse[type].push item
      @spawnEvents[type](item) if @spawnEvents[type]?
      item

    # @param [BaseModel] item
    release: (item) ->
      if typeof item != 'object' || !item.constructor?
        throw new Error("item #{item} can not be released. wront type")

      type = @_validation(item.constructor)

      if @itemsInUse[type].indexOf(item) == -1
        throw new Error("item (#{type}) was not spawned from the pool")

      @itemsInUse[type].remove(item)
      @items[type].push item
      @releaseEvents[type](item) if @releaseEvents[type]?
      return

    on: (which, type, func) ->
      unless @validEvents.includes?(which)
        throw new Error("#{which} invalid. Allowed: #{@validEvents.join(', ')}")
      @["#{which}Events"][type] = func

    onSpawn: (type, func) ->
      @on('spawn', type, func)

    onRelease: (type, func) ->
      @on('release', type, func)

    _validation: (type) ->
      unless type.prototype instanceof BaseModel
        throw new Error("type #{type} not instance of base model")

      @items[type] = [] unless @items[type]?
      @itemsInUse[type] = [] unless @itemsInUse[type]?
      type

    _count: (items) ->
      count = 0
      for key of items
        count += items[key].size()
      count

    toString: ->
      inUse = @_count(@itemsInUse)
      inPool = @_count(@items)

      "#{inUse} items in use\n#{inPool} items waiting in all pools\n#{inUse + inPool} total items"

    releaseAll: ->
      toRelease = []

      for key of @itemsInUse
        for item in @itemsInUse[key]
          toRelease.push item
      for item in toRelease
        @release(item)

      toRelease

  @get: () ->
    instance ?= new Singleton.PoolManager()

  @spawn: (type) ->
    @get().spawn(type)

  @release: (item) ->
    @get().release(item)

  @on: (which, type, func) ->
    @get().on(which, type, func)

  @onSpawn: (type, func) ->
    @get().on('spawn', type, func)

  @onRelease: (type, func) ->
    @get().on('release', type, func)

  @releaseAll: ->
    @get().releaseAll()
