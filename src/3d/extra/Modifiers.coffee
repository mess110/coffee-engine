class FadeInModifier
  constructor: (model) ->
    tween = new TWEEN.Tween({x: 0.5}).to({x: 1}, 700).easing(TWEEN.Easing.Exponential.Out)
    tween.onUpdate( ->
      model.setOpacity(this.x)
    ).start()

class FadeModifier
  constructor: (model, srcX, destX, t) ->
    tween = new TWEEN.Tween({x: srcX}).to({x: destX}, t).easing(TWEEN.Easing.Exponential.Out)
    tween.onUpdate( ->
      model.setOpacity(this.x)
    ).start()

class ShakeModifier
  constructor: (model, t) ->
    ease = TWEEN.Easing.Linear.None
    originalRZ = model.mesh.rotation.z
    tween = new TWEEN.Tween({x: 0}).to({x: t}, t).easing(ease)
    tween.onUpdate( ->
      model.mesh.rotation.z += Math.random() - 0.5
      if @x == 1
        model.mesh.rotation.z = originalRZ
    ).start()

class NoticeMeModifier
  constructor: (model, srcX, destX, t) ->
    ease = TWEEN.Easing.Linear.None
    tween = new TWEEN.Tween({x: srcX}).to({x: destX}, t / 2).easing(ease)
    tween.onUpdate( ->
      model.mesh.scale.set(this.x, this.x, this.x)
    ).start()
    tween = new TWEEN.Tween({x: destX}).to({x: srcX}, t / 2).easing(ease)
    tween.onUpdate( ->
      model.mesh.scale.set(this.x, this.x, this.x)
    ).delay(t / 2).start()
