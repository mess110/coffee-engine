# @example
#   @flipButton = new FlipButton(
#     keyFront: 'endTurnFront'
#     keyBack: 'endTurnBack'
#     width: 8.9
#     height: 6.4
#   )
class FlipButton extends CojocModel
  FRONT: 0
  BACK: 1

  constructor: (options = {}) ->
    throw new Error('options.keyFront missing') unless options.keyFront?
    throw new Error('options.keyBack missing') unless options.keyBack?
    @mesh = new THREE.Object3D()
    @side = @FRONT
    @animationFinished = true

    Glow.addAll(@, options)

    front = new Panel(
      key: options.keyFront, width: options.width, height: options.height)
    front.mesh.renderOrder = renderOrder.get()
    @mesh.add front.mesh

    back = new Panel(key: options.keyBack, width: options.width, height: options.height)
    back.mesh.rotation.y = Math.PI
    back.mesh.renderOrder = renderOrder.get()
    @mesh.add back.mesh

  canPress: ->
    @side == @FRONT

  set: (front)->
    upDur = 600
    downDur = 400
    side = if front then @FRONT else @BACK
    return if side == @side
    @side = side

    @tween.stop() if @tween?
    @tween2.stop() if @tween2?

    rotateAmount = Math.PI
    originalX = 25
    originalZ = 0

    target =
      x: originalX - 4
      z: originalZ + 5
    target2 =
      x: originalX
      z: originalZ
    if side == @FRONT
      target.rX = 0
    else
      target.rX = Math.PI

    @tween = Helper.tween(target: target, mesh: @mesh, relative: false, kind: 'Elastic', direction: 'Out', duration: upDur)
      .onComplete =>
        @tween2 = Helper.tween(target: target2, mesh: @mesh, relative: false, kind: 'Cubic', direction: 'Out', duration: downDur)
          .onComplete =>
            @tween = undefined
            @tween2 = undefined
        @tween2.start()
    @tween.start()
    upDur + downDur

  toggle: ->
    upDur = 600
    downDur = 400
    return unless @animationFinished
    @animationFinished = false
    rotateAmount = Math.PI
    target =
      x: -4
      z: 5
      rX: if @side == @FRONT then -rotateAmount else rotateAmount
    target2 =
      x: 4
      z: -5

    # this needs to be here to change asap
    @side = if @side == @FRONT then @BACK else @FRONT

    @tween = Helper.tween(target: target, mesh: @mesh, relative: true, kind: 'Elastic', direction: 'Out', duration: upDur)
    @tween.onComplete =>
      @tween2 = Helper.tween(target: target2, mesh: @mesh, relative: true, kind: 'Cubic', direction: 'Out', duration: downDur)
        .onComplete =>
          @tween = undefined
          @tween2 = undefined
          @animationFinished = true
      @tween2.start()
    @tween.start()