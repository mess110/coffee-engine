class Glow extends Panel
  constructor: (options = {}) ->
    super(options)
    # @mesh.position.z -= 0.001
    @setVisible(false)
    @mesh.material.depthTest = false
    @mesh.scale.set 1.1, 1.1, 1.1

  @addAll: (model, options) ->
    for glowName in ['glowGreen', 'glowRed', 'glowBlue', 'glowYellow']
      glow = new Glow(
        key: glowName,
        class: 'PlaneGeometry',
        class: 'PlaneBufferGeometry',
        width: options.width, height: options.height,
        wSegments: options.wSegments, hSegments: options.hSegments
      )
      model[glowName] = glow
      glow.mesh.renderOrder = renderOrder.get()
      model.mesh.add glow.mesh
    return

  @flipAll: (model) ->
    for glowName in ['glowGreen', 'glowRed', 'glowBlue', 'glowYellow']
      model[glowName].mesh.rotation.y += Math.PI
      model[glowName].mesh.position.z *= -1
    return
