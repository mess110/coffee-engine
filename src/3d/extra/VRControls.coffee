# VRControls
#
# @example
#   @controls = new VRControls(engine.camera)
#
#   @controls.update(tpf)
class VRControls extends BaseControls
  constructor: (target) ->
    @enabled = true
    @supported = false

    @controls = new (THREE.DeviceOrientationControls)(target, true)

    setOrientationControls = (e) =>
      if !e.alpha
        @enabled = false
        return

      @supported = true
      @controls.connect()
      @controls.update()
      window.removeEventListener 'deviceorientation', setOrientationControls, true
      return

    window.addEventListener 'deviceorientation', setOrientationControls, true

  tick: (tpf) ->
    return unless @enabled
    @controls.update(tpf)

  # alias for tick
  update: (tpf) ->
    @tick(tpf)

  updateAlphaOffsetAngle: (angle) ->
    @controls.updateAlphaOffsetAngle(angle)

  turn: (angle = 45) ->
    @updateAlphaOffsetAngle(@controls.alphaOffsetAngle + angle)

  isSupported: ->
    @areSupported()

  areSupported: ->
    @supported
