class AnimationTest extends TestScene
  init: ->
    super()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    if @jmm.items['chicken']?
      @model = new BaseModel()
      @model.mesh = @jmm.clone('chicken')
      @scene.add @model.mesh
      @model.mesh.animations[0].play()
    else
      @jmm.load 'chicken', 'assets/chicken.json', (mesh) ->
        scene = SceneManager.get().currentScene()
        model = new BaseModel()
        model.mesh = mesh
        scene.model = model
        scene.scene.add model.mesh
        mesh.animations[0].play()

  tick: (tpf) ->

  testInfo: ->
    console.log 'SceneManager.get().currentScene().model.animate(1)'

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
