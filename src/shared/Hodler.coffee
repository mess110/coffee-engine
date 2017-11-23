# Responsible for holding objects
class Hodler

  instance = null

  class Singleton.Hodler
    items: {}

    add: (key, item) ->
      @items[key] = item
      @item(key)

    item: (key) ->
      @items[key]

  @get: () ->
    instance ?= new Singleton.Hodler()

  @add: (key, item) ->
    @get().add(key, item)

  @item: (key) ->
    @get().item(key)
