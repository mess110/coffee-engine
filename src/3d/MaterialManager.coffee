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

  @get: () ->
    instance ?= new Singleton.MaterialManager()
