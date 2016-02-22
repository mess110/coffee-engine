# A wrapper for the virtual joystick.
#
# By default, it has an analog joystick on the left half and a button on the right
# half
#
# @example
#   vj = new VirtualController()
#
#   vj.joystick2.addEventListener 'touchStart', ->
#     console.log 'fire'
#
#   vj.joystick1.deltaX()
#   vj.joystick1.up()
#
# @see https://github.com/jeromeetienne/virtualjoystick.js
# @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
class VirtualController
  # create a new virtual joystick
  constructor: (options = {})->
    @init(options)

  # override this method for a different behaviour
  init: (options) ->
    options = @_defaultOptions(options)

    @joystick1 = new VirtualJoystick(options.joystick1)
    @joystick1.addEventListener 'touchStartValidation', @_leftHalfTouch

    @joystick2 = new VirtualJoystick(options.joystick2)
    @joystick2.addEventListener 'touchStartValidation', @_rightHalfTouch

  # Checks if touch screen is available
  isAvailable: ->
    VirtualJoystick.touchScreenAvailable()

  # @nodoc
  _leftHalfTouch: (event) ->
    touch = event.changedTouches[0]
    touch.pageX < window.innerWidth / 2

  # @nodoc
  _rightHalfTouch: (event) ->
    touch = event.changedTouches[0]
    touch.pageX >= window.innerWidth / 2

  # set default options
  _defaultOptions: (options) ->
    options.joystick1 ?= {}
    options.joystick1.strokeStyle ?= 'cyan'
    options.joystick1.limitStickTravel ?= true
    options.joystick1.mouseSupport ?= true
    options.joystick1.stickRadius ?= 60

    options.joystick2 ?= {}
    options.joystick2.strokeStyle ?= 'orange'
    options.joystick2.limitStickTravel ?= true
    options.joystick2.stickRadius ?= 0
    options
