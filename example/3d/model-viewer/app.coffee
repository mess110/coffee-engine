config = Config.get()
config.fillWindow()

engine = new Engine3D()

class ModelViewer extends BaseScene
  constructor: ->
    super()


    # JsonLoader
    # @model = @testCube()
    @testJson()

  tick: (tpf) ->
    return unless @model?

    @model.rotation.y += 2 * tpf

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

  testCube: ->
    geometry = new (THREE.BoxGeometry)(1, 1, 1)
    material = new (THREE.MeshBasicMaterial)(color: 0x00ff00)
    @model = new (THREE.Mesh)(geometry, material)
    @scene.add @model

  testJson: ->
    loader = new (THREE.JSONLoader)
    # load a resource
    loader.load 'models/plate.js', (geometry, materials) =>
      material = new (THREE.MeshFaceMaterial)(materials)
      @model = new (THREE.Mesh)(geometry, material)
      @scene.add @model

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
