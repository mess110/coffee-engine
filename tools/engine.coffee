config = Config.get()
config.fillWindow()

EngineHolder.get().engine = new Engine3D()
engine = EngineHolder.get().engine
engine.camera.position.set 7.4, 11.8, 10.1

modelViewerScene = new ModelViewerScene()
engine.addScene(modelViewerScene)

bezierScene = new BezierScene()
engine.addScene(bezierScene)

terrainGeneratorScene = new TerrainGeneratorScene()
engine.addScene(terrainGeneratorScene)

particlePlaygroundScene = new ParticlePlaygroundScene()
engine.addScene(particlePlaygroundScene)

shaderEditorScene = new ShaderEditorScene()
engine.addScene(shaderEditorScene)

graffitiPainterScene = new GraffitiPainterScene()
engine.addScene(graffitiPainterScene)

EngineHolder.get().engine.removeDom()
engine.start()
