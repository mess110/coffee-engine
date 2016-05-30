config = Config.get()
config.fillWindow()
# config.toggleStats()

engine = new Engine3D()

loadingScene = Engine3D.scenify()

engine.render()
