# @nodoc
class MaterialManager

  instance = null

  # Stores materials
  class Singleton.MaterialManager
    items: {}

    # Add a material
    #
    # @param [String] key
    # @param [Material] url of the texture
    load: (key, material) ->
      @items[key] = material
      @

    item: (key) ->
      throw new Error("#{key} not found in MaterialManager") unless @items[key]?
      @items[key]

  @get: () ->
    instance ?= new Singleton.MaterialManager()

  @load: (key, material) ->
    @get().load(key, material)

  @item: (key) ->
    @get().item(key)
