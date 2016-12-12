class BaseModifier
  start: ->
    @tween.start()

  delay: (delay = 0) ->
    @tween.delay(delay)
    @

# Fades in a BaseModel
# legacy - use FadeModifier instead
class FadeInModifier extends BaseModifier
  # @param [BaseModel] model
  constructor: (model) ->
    @tween = new TWEEN.Tween({x: 0.5}).to({x: 1}, 700).easing(TWEEN.Easing.Exponential.Out)
    @tween.onUpdate( ->
      model.setOpacity(this.x)
    )

# Fades a BaseModel
class FadeModifier extends BaseModifier
  # @param [BaseModel] model
  # @param [Number] srcX - source alpha
  # @param [Number] destX - destination alpha
  # @param [Number] t - duration
  constructor: (model, srcX, destX, t) ->
    @tween = new TWEEN.Tween({x: srcX}).to({x: destX}, t).easing(TWEEN.Easing.Exponential.Out)
    @tween.onUpdate( ->
      model.setOpacity(this.x)
    )

# Shakes a BaseModel
class ShakeModifier extends BaseModifier
  # @param [BaseModel] model
  # @param [Number] t - duration
  constructor: (model, t) ->
    ease = TWEEN.Easing.Linear.None
    originalRZ = model.mesh.rotation.z
    @tween = new TWEEN.Tween({x: 0}).to({x: t}, t).easing(ease)
    @tween.onUpdate( ->
      model.mesh.rotation.z += Math.random() - 0.5
      if @x == 1
        model.mesh.rotation.z = originalRZ
    )

# Changes the scale of a BaseModel
class ScaleModifier extends BaseModifier
  # @param [BaseModel] model
  # @param [Number] srcX - original scale
  # @param [Number] destX - destination scale
  # @param [Number] t - duration
  constructor: (model, srcX, destX, t) ->
    ease = TWEEN.Easing.Linear.None
    @tween = new TWEEN.Tween({x: srcX}).to({x: destX}, t).easing(ease)
    @tween.onUpdate( ->
      model.mesh.scale.set(this.x, this.x, this.x)
    )

# Notice animation to a BaseModel
class NoticeMeModifier extends BaseModifier
  # @param [BaseModel] model
  # @param [Number] srcX - original scale
  # @param [Number] destX - destination scale
  # @param [Number] t - duration
  constructor: (model, srcX, destX, t) ->
    @scale1 = new ScaleModifier(model, srcX, destX, t / 2)
    @scale2 = new ScaleModifier(model, destX, srcX, t / 2)
    @t = t

  start: ->
    @scale1.start()
    @scale2.start()

  delay: (delay = 0) ->
    @scale1.delay(delay)
    @scale2.delay(delay + @t / 2)
    @
