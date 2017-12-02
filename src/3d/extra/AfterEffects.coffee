# Used to generate after effects and enable/disable on a scene/camera basis
# Overwrite the effects method to get the required effect
#
# @example
#   Hodler.add('afterEffects', new AfterEffects(engine))
#   Hodler.item('afterEffects').enable(@scene, @camera)
#   Hodler.item('afterEffects').disable()
class AfterEffects
  constructor: (engine) ->
    @engine = engine
    @effects()

  effects: ->
    @renderModel = new (THREE.RenderPass)(undefined, undefined) # scene, camera
    effectBloom = new (THREE.BloomPass)(1.25)
    effectCopy = new (THREE.ShaderPass)(THREE.CopyShader)
    effectCopy.renderToScreen = true
    # effectFilm = new (THREE.FilmPass)(0.15, 0.95, 2048, false)
    # effectFilm.renderToScreen = true
    @composer = new (THREE.EffectComposer)(@engine.renderer)
    @composer.addPass @renderModel
    @composer.addPass effectBloom
    @composer.addPass effectCopy
    # @composer.addPass effectFilm

  enable: (scene, camera) ->
    @renderModel.scene = scene if scene?
    @renderModel.camera = camera if camera?
    @engine.enableComposer(@composer)

  disable: ->
    @engine.disableComposer(@composer)
