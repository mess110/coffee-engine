# @nodoc
class EngineHolder

  instance = null

  class Singleton.EngineHolder

  @get: () ->
    instance ?= new Singleton.EngineHolder()
