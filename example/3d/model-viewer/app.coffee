config = Config.get()
config.fillWindow()

engine = new Engine3D()
engine.camera.position.set 0, 30, 190

class ModelViewer extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.light()
    # Helper.fancyShadows(engine.renderer)

    @testCube()
    @testJson()

  tick: (tpf) ->
    return unless @model?

    @model.rotation.y += 1 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

  testCube: ->
    @model = Helper.cube()
    @scene.add @model

  testJson: ->
    loader = new (THREE.JSONLoader)
    mesh = undefined
    loader.load 'models/car.js', (geometry, materials) ->
      material = new (THREE.MeshLambertMaterial)(
        map: THREE.ImageUtils.loadTexture('models/gtare.jpg')
        colorAmbient: [
          0.480000026226044
          0.480000026226044
          0.480000026226044
        ]
        colorDiffuse: [
          0.480000026226044
          0.480000026226044
          0.480000026226044
        ]
        colorSpecular: [
          0.8999999761581421
          0.8999999761581421
          0.8999999761581421
        ])
      mesh = new (THREE.Mesh)(geometry, material)
      mesh.receiveShadow = true
      mesh.castShadow = true
      mesh.rotation.y = -Math.PI / 5
      scene = engine.sceneManager.currentScene()
      scene.scene.add mesh
      scene.model = mesh

    loader = new (THREE.JSONLoader)

  testStl: ->
    url = 'models/plate.stl'
    loader = new THREE.STLLoader()
    loader.load( url, (geometry) =>
      @model = new THREE.Mesh( geometry )
      @scene.add @model
    )

modelViewer = new ModelViewer()
engine.addScene(modelViewer)

engine.render()
