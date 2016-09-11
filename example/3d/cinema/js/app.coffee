config = Config.get()
config.fillWindow()
# config.toggleStats()

engine = new Engine3D()

Engine3D.scenify(engine, ->
  console.log 'cinematic started'
)

engine.render()
