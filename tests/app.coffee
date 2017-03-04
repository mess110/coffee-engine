config = Config.get()

Persist.PREFIX = 'ce.tests'
Persist.default('lastTest', 0)

# config.toggleDebug()
# config.toggleStats()
config.fillWindow()

engine = new Engine3D()

scenes = new CyclicArray([
  new BasicTest()
  new ShaderTest()
  new AnimationTest()
  new DissolveTest()
  new PoolTest()
])

nextScene = ->
  engine.initScene(scenes.next())
  console.log scenes.get().constructor.name
  Persist.set('lastTest', scenes.index)

Engine3D.scenify(engine, ->
  scenes.index = Persist.get('lastTest')
  console.log scenes.get().constructor.name
  engine.initScene(scenes.get())
)

engine.start()
