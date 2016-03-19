# Persist data on the client
#
# Features:
#
# * prefix (default: 'ce.')
# * default values
# * clear storage with exceptions
# * auto converts number and boolean values
#
# @example
#   Persist.PREFIX = 'coffee.engine.'
#   Persist.set('hello', 'dear')
#   Persist.get('hello') # returns dear
#
# @example
#   Persist.set('hello', 'dear', 'world') # world is default value
#
# @example
#   persist = new Persist()
#   persist.default('hello', 'world')
#   persist.get('hello') # returns world
class Persist
  @PREFIX = 'ce'
  @DEFAULT_SUFFIX = 'default'

  # chooses storage type. By default, it uses localStorage
  #
  # @see https://developer.mozilla.org/en/docs/Web/API/Window/localStorage
  constructor: () ->
    @storage = localStorage

  setJson: (key, value, def=undefined) ->
    value = JSON.stringify(value)
    def = JSON.stringify(def) if def?
    @set(key, value, def)

  # set a value in the storage
  #
  # @param [String] key
  # @param [Object] value
  set: (key, value, def=undefined) ->
    throw 'key missing' unless key?
    @storage["#{Persist.PREFIX}.#{key}"] = value
    @default(key, def) if def?

  defaultJson: (key, value) ->
    value = JSON.stringify(value)
    @default(key, value)

  # set the default value for a key
  #
  # The default value is stored in the same storage and has the suffix DEFAULT_SUFFIX
  #
  # @param [String] key
  # @param [Object] value
  #
  # @see DEFAULT_SUFFIX
  default: (key, value) ->
    @set("#{key}.#{Persist.DEFAULT_SUFFIX}", value)

  getJson: (key) ->
    item = @get(key)
    if item?
      return JSON.parse(item)

  # Get a value in the storage. If the value does not exist,
  # it checks for the default value
  #
  # automatically convers to the correct type
  #
  # @param [String] key
  get: (key) ->
    value = @_get(key)
    if !value? then @_get("#{key}.#{Persist.DEFAULT_SUFFIX}") else value

  # Get a value in the storage
  _get: (key) ->
    throw 'key missing' unless key?
    value = @storage["#{Persist.PREFIX}.#{key}"]
    return Number(value) if isNumeric(value)
    return Boolean(value) if ['true', 'false'].includes(value)
    return undefined if value == 'undefined'
    value

  # Removes item from storage
  #
  # @param [String] key
  rm: (key) ->
    throw 'key missing' unless key?
    @storage.removeItem("#{Persist.PREFIX}.#{key}")

  # clear storage with exceptions
  #
  # @param [Array] exceptions
  # @param [Boolean] withDefaults also include defaults in the deletion
  clear: (exceptions=[], withDefaults=false) ->
    exceptions = [exceptions] unless exceptions instanceof Array
    for storage of @storage
      continue if storage.endsWith(".#{Persist.DEFAULT_SUFFIX}") and withDefaults == false
      if !exceptions.includes(storage)
        @rm(storage)

  # @see get
  @getJson: (key) ->
    new Persist().getJson(key)

  # @see get
  @get: (key) ->
    new Persist().get(key)

  # @see set
  @setJson: (key, value, def) ->
    new Persist().setJson(key, value, def)

  # @see set
  @set: (key, value, def) ->
    new Persist().set(key, value, def)

  # @see default
  @default: (key, value) ->
    new Persist().default(key, value)

  @defaultJson: (key, value) ->
    new Persist().defaultJson(key, value)

  # @see rm
  @rm: (key) ->
    new Persist().rm(key)

  # @see clear
  @clear: (exceptions, withDefaults) ->
    new Persist().clear(exceptions, withDefaults)
