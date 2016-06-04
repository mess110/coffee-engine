config = Config.get()
config.fillWindow()
# config.toggleStats()

engine = new Engine3D()

Engine3D.scenify(->
  console.log 'cinematic started'
)

engine.render()
