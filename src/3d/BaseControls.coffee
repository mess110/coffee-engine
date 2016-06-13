# Base class for controls
#
# @example
#   @controls = new BaseControls(@player, @keyboard)
#
#   @controls.tick(tpf)
#
# @example
#   @controls = new BaseControls(@player, @keyboard)
#   @controls.enabled = false
class BaseControls
  # keybindings can be either a string or an array of strings
  @KEY_BINDINGS:
    UP: 'w'
    DOWN: ['s']
    LEFT: 'a'
    RIGHT: 'd'

  # @param [BaseModel] jsonModel
  # @param [THREEx.Keyboard] keyboard
  constructor: (jsonModel, keyboard) ->
    @enabled = true
    @jsonModel = jsonModel
    @keyboard = keyboard
    @lock = false
    @moving = false

  # toggle lock on/off
  # this method does too much and name does not match. fix it
  toggleLock: (target) ->
    return unless @enabled
    @lock = !@lock
    if @lock
      @target = target
    else
      @target = undefined

  # check if a keybinding is pressed
  #
  # @param [BaseControls.KEY_BINDINGS] binding
  isPressed: (bindings) ->
    bindings = [bindings] unless bindings instanceof Array
    for binding in bindings
      return true if @keyboard.pressed(binding)
    false

  # formats the output
  # TODO: find out if needed
  formatOutput: ->
    {
      moving: @moving
      lock: @lock
    }

  # bindings when lock is true
  withLock: (tpf) ->
    return unless @target?
    @jsonModel.model.lookAt(@target.model.position)
    if @isPressed(BaseControls.KEY_BINDINGS.UP)
      @jsonModel.model.translateZ(tpf)
      @moving = true
    else if @isPressed(BaseControls.KEY_BINDINGS.DOWN)
      @jsonModel.model.translateZ(-tpf)
      @moving = true
    else if @isPressed(BaseControls.KEY_BINDINGS.LEFT)
      @jsonModel.model.translateX(tpf)
      @moving = true
    else if @isPressed(BaseControls.KEY_BINDINGS.RIGHT)
      @jsonModel.model.translateX(-tpf)
      @moving = true
    else
      @moving = false
    @formatOutput()

  # bindings when lock is false
  noLock: (tpf) ->
    if @isPressed(BaseControls.KEY_BINDINGS.UP)
      @jsonModel.model.rotation.set 0, Math.PI, 0
      @jsonModel.model.translateZ(tpf)
      @moving = true
    else if @isPressed(BaseControls.KEY_BINDINGS.DOWN)
      @jsonModel.model.rotation.set 0, 0, 0
      @jsonModel.model.translateZ(tpf)
      @moving = true
    else if @isPressed(BaseControls.KEY_BINDINGS.LEFT)
      @jsonModel.model.rotation.set 0, -Math.PI / 2, 0
      @jsonModel.model.translateZ(tpf)
      @moving = true
    else if @isPressed(BaseControls.KEY_BINDINGS.RIGHT)
      @jsonModel.model.rotation.set 0, Math.PI / 2, 0
      @jsonModel.model.translateZ(tpf)
      @moving = true
    else
      @moving = false
    @formatOutput()

  # basic tick method
  #
  # if the @jsonModel is a BaseModel, it will also attempt to animate it
  #
  # @param [number] tpf
  tick: (tpf) ->
    return unless @enabled

    output = if @lock then @withLock(tpf) else @noLock(tpf)
    if @jsonModel instanceof BaseModel
      if @moving
        if !@jsonModel.isPlaying('walk')
          @jsonModel.stopAnimations()
          @jsonModel.animate('walk')
      else
        if !@jsonModel.isPlaying('idle')
          @jsonModel.stopAnimations()
          @jsonModel.animate('idle')
    output

  # override this
  doKeyboardEvent: (event) ->

  # override this
  doMouseEvent: (event, raycaster) ->
