class CojocLoadingScene extends LoadingScene
  preStart: ->
    engine.camera.position.set 0, 1, 5

    @scene.add Helper.light(x: 0, y: 0, z: 10)
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    @jmm.load('putinei', 'assets/putinei.json', (mesh) =>
      @putinei = mesh
      @scene.add @putinei
      mesh.animations[0].play()
    )

  tick: (tpf) ->
    return unless @putinei?
    @putinei.rotation.y += tpf
