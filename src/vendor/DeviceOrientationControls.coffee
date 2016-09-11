###*
# @author richt / http://richt.me
# @author WestLangley / http://github.com/WestLangley
#
# W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
###

THREE.DeviceOrientationControls = (object) ->
  scope = this
  @object = object
  @object.rotation.reorder 'YXZ'
  @enabled = true
  @deviceOrientation = {}
  @screenOrientation = 0
  @alpha = 0
  @alphaOffsetAngle = 0

  onDeviceOrientationChangeEvent = (event) ->
    scope.deviceOrientation = event
    return

  onScreenOrientationChangeEvent = ->
    scope.screenOrientation = window.orientation or 0
    return

  # The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
  setObjectQuaternion = do ->
    zee = new (THREE.Vector3)(0, 0, 1)
    euler = new (THREE.Euler)
    q0 = new (THREE.Quaternion)
    q1 = new (THREE.Quaternion)(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))
    # - PI/2 around the x-axis
    (quaternion, alpha, beta, gamma, orient) ->
      euler.set beta, alpha, -gamma, 'YXZ'
      # 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler euler
      # orient the device
      quaternion.multiply q1
      # camera looks out the back of the device, not the top
      quaternion.multiply q0.setFromAxisAngle(zee, -orient)
      # adjust for screen orientation
      return

  @connect = ->
    onScreenOrientationChangeEvent()
    # run once on load
    window.addEventListener 'orientationchange', onScreenOrientationChangeEvent, false
    window.addEventListener 'deviceorientation', onDeviceOrientationChangeEvent, false
    scope.enabled = true
    return

  @disconnect = ->
    window.removeEventListener 'orientationchange', onScreenOrientationChangeEvent, false
    window.removeEventListener 'deviceorientation', onDeviceOrientationChangeEvent, false
    scope.enabled = false
    return

  @update = ->
    if scope.enabled == false
      return
    alpha = if scope.deviceOrientation.alpha then THREE.Math.degToRad(scope.deviceOrientation.alpha) + @alphaOffsetAngle else 0
    # Z
    beta = if scope.deviceOrientation.beta then THREE.Math.degToRad(scope.deviceOrientation.beta) else 0
    # X'
    gamma = if scope.deviceOrientation.gamma then THREE.Math.degToRad(scope.deviceOrientation.gamma) else 0
    # Y''
    orient = if scope.screenOrientation then THREE.Math.degToRad(scope.screenOrientation) else 0
    # O
    setObjectQuaternion scope.object.quaternion, alpha, beta, gamma, orient
    @alpha = alpha
    return

  @updateAlphaOffsetAngle = (angle) ->
    @alphaOffsetAngle = angle
    @update()
    return

  @dispose = ->
    @disconnect()
    return

  @connect()
  return
