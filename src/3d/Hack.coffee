# exports is used server side to require classes
exports = undefined
if typeof exports == 'undefined' or exports == null
  exports = {}

# Namespace for implementing the singleton pattern.
#
# Singleton objects are defined in this namespace so they do not have name collisions
# in the documentation, although they each live in their own separate private context
# at runtime.
#
# For example, Config is a singleton object.
#
# @example
#   config = Config.get()
#   config.width = 100
#
# @example
#   # This is how singleton Config is implemented:
#   class Config
#     instance = null
#
#     class Singleton.Config
#       toggleDebug: ->
#         # some code
#
#     @get: ->
#       instance ?= new Singleton.Config()
#
# @see Config
class Singleton

# TODO: move this outside because it is not a hack
THREE.Object3D::clear = ->
  children = @children
  i = children.length - 1
  while i >= 0
    child = children[i]
    child.clear()
    @remove child
    i--
  return
