config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 5, 10

class LoadingScene extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.light()


    light = new (THREE.AmbientLight)(0x404040)
    @scene.add light
    # @scene.add Helper.cube()

    loader = new (THREE.JSONLoader)
    animation = undefined
    # load the model and create everything
    loader.load 'animation.json', (geometry, materials) ->
      mesh = undefined
      material = undefined
      # create a mesh
      mesh = new (THREE.SkinnedMesh)(geometry, new (THREE.MeshFaceMaterial)(materials))
      # define materials collection
      material = mesh.material.materials
      # enable skinning
      i = 0
      while i < materials.length
        mat = materials[i]
        mat.skinning = true
        i++
      mesh.rotation.y = Math.PI / 2
      engine.sceneManager.currentScene().scene.add mesh

      a = mesh.geometry.animations[0]
      animation = new (THREE.Animation)(mesh, a, THREE.AnimationHandler.CATMULLROM)
      animation.play()

      engine.sceneManager.currentScene().loaded = true

  tick: (tpf) ->
    return unless @loaded

    THREE.AnimationHandler.update(tpf / 2)

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

loadingScene = new LoadingScene()
engine.addScene(loadingScene)

engine.render()
