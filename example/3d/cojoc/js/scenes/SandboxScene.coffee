DissolvingEffect = (object, color, duration, fadeOut, noiseTexture) ->
  active = true
  speed = (if fadeOut then +1.0 else -1.0) / duration
  originalMaterial = if fadeOut then new (THREE.MeshBasicMaterial)(visible: false) else object.material
  object.material = new (THREE.ShaderMaterial)(
    uniforms:
      texture:
        type: 't'
        value: object.material.map
      noise:
        type: 't'
        value: noiseTexture
      color:
        type: 'c'
        value: new (THREE.Color)(color)
      dissolve:
        type: 'f'
        value: if fadeOut then 0.0 else 1.0
    morphTargets: object.material.morphTargets
    vertexShader: @vertexShader
    fragmentShader: @fragmentShader
    shading: THREE.SmoothShading)

  @dispose = ->
    if active
      active = false
      object.material.dispose()
      object.material = originalMaterial
    return

  @update = (dt) ->
    if active
      dissolve = object.material.uniforms.dissolve.value
      if speed < 0 and dissolve > 0 or speed > 0 and dissolve < 1
        object.material.uniforms.dissolve.value = dissolve + dt * speed
        # not yet done
        return false
      @dispose()
    # done
    true

  return

DissolvingEffect.prototype =
  vertexShader: 'varying vec2 vUv;\
    uniform float morphTargetInfluences[ 8 ];\
    void main() {\
      vUv = uv;\
      vec3 morphed = vec3( 0.0 );\
      \n#ifdef USE_MORPHTARGETS\n\
      morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\
      morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\
      morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\
      morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\
      morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\
      morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\
      morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\
      morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\
      \n#endif\n\
      morphed += position;\
      gl_Position = projectionMatrix * (modelViewMatrix * vec4( morphed, 1.0 ));\
    }',
  fragmentShader: 'varying vec2 vUv;\
    uniform sampler2D texture;\
    uniform sampler2D noise;\
    uniform vec3 color;\
    uniform float dissolve;\
    void main() {\
      vec4 c4 = texture2D( texture, vUv );\
      float n = texture2D( noise, vUv ).x - dissolve;\
      if (n < 0.0) { discard; }\
      if (n < 0.05) { c4.rgb = color; }\
      gl_FragColor = c4;\
    }'

class SandboxScene extends BaseScene
  tm: TextureManager.get()
  cards: []

  init: ->
    engine.camera.position.set 0, 0, 20
    engine.camera.lookAt(Helper.zero)

    @card = new Card().switchTo(constants.cards[6])
    @scene.add @card.mesh

    @controls = Helper.orbitControls(engine)

  uninit: ->
    super()
    @controls.enabled = false

  tick: (tpf) ->
    if @card.dissolveEffect?
      @card.dissolveEffect.update(tpf)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
