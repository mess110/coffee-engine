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
    throw new Exception('options.keyFront missing') unless options.keyFront?
    throw new Exception('options.keyBack missing') unless options.keyBack?
    @mesh = new THREE.Object3D()
    @side = @FRONT
    @animationFinished = true

    Glow.addAll(@, options)

    front = new Panel(
      key: options.keyFront, width: options.width, height: options.height)
    @mesh.add front.mesh

    back = new Panel(key: options.keyBack, width: options.width, height: options.height)
    back.mesh.rotation.y = Math.PI
    @mesh.add back.mesh

  toggle: ->
    upDur = 600
    downDur = 400
    return unless @animationFinished
    @animationFinished = false
    rotateAmount = Math.PI
    target =
      z: 3
      rX: if @side == @FRONT then -rotateAmount else rotateAmount
    target2 =
      z: -3

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
